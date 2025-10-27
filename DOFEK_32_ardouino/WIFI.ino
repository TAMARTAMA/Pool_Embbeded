
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

void getTemperature() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = "http://" + String(serverIP) + ":" + String(serverPort) + "/temperature/getTemp";
    Serial.print("שולח בקשה אל: ");
    Serial.println(url);

    http.begin(url);
    int httpCode = http.GET();

    if (httpCode > 0) {
      String payload = http.getString();
      Serial.print("תגובה מהשרת: ");
      Serial.println(payload);
    } else {
      Serial.print("שגיאה בבקשת GET: ");
      Serial.println(http.errorToString(httpCode));
    }

    http.end();
  } else {
    Serial.println("לא מחובר ל-WiFi, לא נשלחה בקשה.");
  }
}
void postEmgercy(String alertId, String userId, String alertType, int sensorValue) {
  if (WiFi.status() == WL_CONNECTED) {
   HTTPClient http;
String url = "http://" + String(serverIP) + ":" + String(serverPort) + "/emergency/add";
    http.begin(url); // התחברות לכתובת ה-API
    http.addHeader("Content-Type", "application/json"); // קביעת סוג התוכן של הבקשה

    // יצירת הנתונים בפורמט JSON
    String jsonPayload = "{\"alertId\": \"" + alertId + "\", \"userId\": \"" + userId + "\", \"alertType\": \"" + alertType + "\", \"sensorValue\": " + String(sensorValue) + "}";

    // שליחת בקשת POST עם הנתונים
    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      Serial.println("Alert sent successfully");
      String response = http.getString();
      Serial.println("Server response: " + response);
    } else {
      Serial.println("Error sending POST request");
    }

    http.end(); // סיום הבקשה
  
  delay(10000); // המתנה של 10 שניות לפני שליחת הבקשה הבאה
  } else {
    Serial.println("לא מחובר ל-WiFi, לא נשלחה בקשה.");
  }
}
void connectToWiFi() {
  Serial.print("מתחבר ל-WiFi...");
  WiFi.begin(ssid, password);
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startTime < 10000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi מחובר!");
  } else {
    Serial.println("\nשגיאה בהתחברות לרשת.");
  }
}
void getRecentUserId() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "http://" + String(serverIP) + ":" + String(serverPort) + "/user/getRecent";
    http.begin(url);

    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();
      Serial.println("תגובה מהשרת:");
      Serial.println(payload);

      // ניתוח ה-JSON
      StaticJsonDocument<512> doc;
      DeserializationError error = deserializeJson(doc, payload);

      if (!error) {
        userId = doc["user"]["userId"].as<String>();

        Serial.print("userId שהתקבל: ");
        Serial.println(userId);
      } else {
        Serial.print("שגיאה בפענוח JSON: ");
        Serial.println(error.c_str());
      }

    } else {
      Serial.print("שגיאה בבקשה: ");
      Serial.println(http.errorToString(httpCode));
    }

    http.end();
  } else {
    Serial.println("לא מחובר ל-WiFi");
  }
}

