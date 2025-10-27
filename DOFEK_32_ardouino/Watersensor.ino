

#define WET_THRESHOLD 20
#define POWER_PIN  18 // ESP32 pin GPIO18 connected to sensor's VCC pin
#define SIGNAL_PIN 4 //
// אתחול תקשורת סידורית
int value = 0; 



void configureADC() {
  analogSetAttenuation(ADC_11db); // התאמה לטווח עד 3.3V
}

// הגדרת פין ההפעלה של החיישן
void configureSensorPowerPin() {
  pinMode(POWER_PIN, OUTPUT);
}

// כיבוי החיישן
void turnSensorOff() {
  digitalWrite(POWER_PIN, LOW);
}

// הפעלת החיישן, קריאה, וכיבויו – מחזיר את הערך שנמדד
int readWaterSensor() {
  digitalWrite(POWER_PIN, HIGH); // הפעלת החיישן
  delay(10);                     // זמן המתנה לייצוב הקריאה
  int sensorValue = analogRead(SIGNAL_PIN); // קריאת ערך מהחיישן
  digitalWrite(POWER_PIN, LOW);  // כיבוי החיישן
  return sensorValue;
}

// הדפסת הערך ל־Serial Monitor
void printSensorValue(int sensorValue) {
  Serial.print("The water sensor value: ");
  Serial.println(sensorValue);
}

bool classifySensorState() {
  value = readWaterSensor();
  printSensorValue(value);
  delay(1000); // השהייה של שנייה בין קריאות
  if (value > WET_THRESHOLD) {
    return true;
  } else {
    return false;
  }
   return false;
}