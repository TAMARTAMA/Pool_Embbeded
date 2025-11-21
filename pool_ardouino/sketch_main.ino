
#include <Wire.h>
#include <WiFi.h> 

#include <HTTPClient.h>
#include <ArduinoJson.h>
const char* ssid = "DESKTOP-P6FFS03 5806";
const char* password = "73f|X048";
const char* serverPort = "5000";
const char* serverIP = "192.168.137.1";
const char* baseURL = "http://192.168.137.1:5000";
 String Globaltag="";
void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password); 

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("");
    Serial.println("Failed to connect to WiFi");
  }
}
int measurementId = 5; 

void postTemperature(float temp) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected");
    return;
  }

  HTTPClient http;

  String url = "http://" + String(serverIP) + ":" + String(serverPort) + "/temperature/addTemp";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  String jsonPayload = "{";
  jsonPayload += "\"measurementId\": " + String(measurementId++) + ",";
  jsonPayload += "\"temperature\": " + String(temp, 2);
  jsonPayload += "}";

  Serial.println("Sending POST request to: " + url);
  Serial.println("Payload: " + jsonPayload);

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.println("Server response: " + response);
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(http.errorToString(httpResponseCode));
  }

}
String name="";
void userLogin(String tag) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "http://" + String(serverIP) + ":" + String(serverPort) + "/user/login?tag="+tag;
    http.begin(url);

    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();
      Serial.println("תגובה מהשרת:");
      Serial.println(payload);

      StaticJsonDocument<512> doc;
      DeserializationError error = deserializeJson(doc, payload);

      if (!error) {
        name = doc["name"].as<String>();

        Serial.print("name שהתקבל: ");
        Serial.println(name);
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

      StaticJsonDocument<512> doc;
      DeserializationError error = deserializeJson(doc, payload);

      if (!error) {
         name = doc["user"]["fullName"].as<String>();
        Globaltag=doc["user"]["rfidTag"].as<String>();
        Serial.print("name שהתקבל: ");
        Serial.println(name);
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

void addEntry(String tag) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "http://" + String(serverIP) + ":" + String(serverPort) + "/entry/addEntry?tag="+tag;
    http.begin(url);

    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();
      Serial.println("תגובה מהשרת:");
      Serial.println(payload);

      StaticJsonDocument<512> doc;
      DeserializationError error = deserializeJson(doc, payload);

      if (!error) {
        String name = doc["data"].as<String>();

        Serial.print("הנתונים של תאריך הכניסה  ");
        Serial.println(name);
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


#define LM75_ADDRESS 0x3C  

void enableSensorTemp() {
  Wire.begin(); 
  Serial.println("Sensor enabled");
}

void disableSensorTemp() {
  Serial.println("Sensor disabled (simulated)");
}

float readTemperature() {
  Wire.beginTransmission(LM75_ADDRESS);
  Wire.write(0x00);  
  Wire.endTransmission(false);

  Wire.requestFrom(LM75_ADDRESS, 2);  

  if (Wire.available() == 2) {
    byte msb = Wire.read();
    byte lsb = Wire.read();
    int temp = ((msb << 8) | lsb) >> 5;
    if (temp > 1023) temp -= 2048; // תיקון לשלילי
    float celsius = temp * 0.125;
    return celsius;
  } else {
    Serial.println("Failed to read from LM75 sensor.");
    return NAN;
  }
}
const int SERVO_PIN = 27;
Servo myServo;

void turnOnServo() {
myServo.attach(SERVO_PIN, 500, 2400);
  Serial.println("Servo attached");
}

]void turnOffServo() {
  myServo.detach();
  Serial.println("Servo detached");
}

void rotateServoMax() {
  myServo.write(180);  
  Serial.println("Rotated to 180 degrees");
}


const int trigPin = 12;
const int echoPin = 13;

#define SOUND_SPEED 0.034
#define CM_TO_INCH 0.393701

long duration;
float distanceCm;
float distanceInch;
float measureDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distanceCm = duration * SOUND_SPEED / 2;
  distanceInch = distanceCm * CM_TO_INCH;

  Serial.print("Distance (cm): ");
  Serial.println(distanceCm);
  Serial.print("Distance (inch): ");
  Serial.println(distanceInch);
  return distanceInch;
}

void enableSensorHeight() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void disableSensor() {
  pinMode(trigPin, INPUT);
  pinMode(echoPin, INPUT);
}


void setup() {
  Serial.begin(115200); 
  Wire.begin();
 connectToWiFi();
}

void loop() {
  Serial.println("start");
  Globaltag="";
  enableSensorHeight();
  delay(100); 
  enableSensorTemp(); 
  delay(100); 
  while(measureDistance()<1){
    Serial.println("low height");
    delay(100); 
  }
  InitRFID();
  delay(100); 
  bool flag=true;
  int count=0;
  while(flag){
     Globaltag = activateRFID(); 
    Serial.println(Globaltag);
     if (Globaltag != "NO") {
        Serial.println("Known tag detected!");
        userLogin(Globaltag);
     }
    else 
      Serial.println("Unknown tag!");
    if(count>2){
      flag=false;
      getRecentUserId();
    }
    count++;
  }
  deactivateRFID();
  delay(100); 
  
  Serial.println("Unknown tag!");
  turnOnServo();         
  rotateServoMax();      
  delay(2000);
  turnOffServo();
  delay(1000);

  disableSensor();
  addEntry(Globaltag);
   float temperature = readTemperature();
    if (!isnan(temperature)) {
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" °C");
    postTemperature(temperature);
    }
    disableSensorTemp();
    delay(2000);  
}

