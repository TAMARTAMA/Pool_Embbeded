#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"

MAX30105 particleSensor;

#define I2C_SDA 21
#define I2C_SCL 22

unsigned long lastBeat = 0;
float beatsPerMinute;
float beatAvg;
bool flag=true;

float bpm = 0;


const char* ssid = "DESKTOP-P6FFS03 5806";     
const char* password = "73f|X048";   
String userId;
const char* serverIP = "192.168.137.1";  
const int serverPort = 5000;

void setup() {
  Serial.begin(115200);
  connectToWiFi();
  getTemperature();
  delay(1000);
  getRecentUserId();
  setupSensor();
}

void loop() {
   long irValue = particleSensor.getIR();
  if (!isFingerOnSensor(irValue)) {
    Serial.println("אין אצבע על החיישן");
    delay(500);
    postEmgercy("0", String(userId),"SIGNAL_LOST", 0);
    return;
  }

  Serial.print(userId);
  if (checkForBeat(irValue)) {
    readVitals();
    String state = evaluateSensorState(bpm);
    Serial.print("מצב: ");
    Serial.println(state);
    postEmgercy("0", String(userId),state, bpm);
  } else {
    Serial.println("מחפש דופק...");
  }
  Serial.println("רמת מים: "+readWaterSensor());

  delay(50000);
  
}




