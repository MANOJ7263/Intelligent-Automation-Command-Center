package com.mano.iacc.integration.uipath.service;

import com.mano.iacc.integration.uipath.config.UiPathProperties;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class UiPathJobService {

  private final UiPathAuthService authService;
  private final UiPathProperties props;
  private final RestTemplate restTemplate = new RestTemplate();

  public UiPathJobService(UiPathAuthService authService,
      UiPathProperties props) {
    this.authService = authService;
    this.props = props;
  }

  public String startJob(String releaseKey) {

    String token = authService.getAccessToken();

    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(token);
    headers.setContentType(MediaType.APPLICATION_JSON);

    String payload = """
        {
          "startInfo": {
            "ReleaseKey": "%s",
            "Strategy": "All"
          }
        }
        """.formatted(releaseKey);

    HttpEntity<String> entity = new HttpEntity<>(payload, headers);

    // Call StartJobs API
    String url = props.getOrchestratorUrl() + "/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs";
    ResponseEntity<String> response = restTemplate.postForEntity(
        url,
        entity,
        String.class);

    // Rudimentary parsing for ID (In a real app, use Jackson/DTOs)
    // Response format: { "value": [ { "Key": "GUID", ... } ] }
    String body = response.getBody();
    if (body != null && body.contains("\"Key\":\"")) {
      int start = body.indexOf("\"Key\":\"") + 7;
      int end = body.indexOf("\"", start);
      return body.substring(start, end);
    }
    return null;
  }

  public String getJobStatus(String jobKey) {
    String token = authService.getAccessToken();
    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(token);
    HttpEntity<Void> entity = new HttpEntity<>(headers);

    String url = props.getOrchestratorUrl() + "/odata/Jobs(" + jobKey + ")";
    try {
      ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
      String body = response.getBody();
      // JSON: { "Key": "...", "State": "Success", ... }
      if (body != null && body.contains("\"State\":\"")) {
        int start = body.indexOf("\"State\":\"") + 9;
        int end = body.indexOf("\"", start);
        return body.substring(start, end);
      }
      return "Unknown";
    } catch (Exception e) {
      return "Error";
    }
  }
}
