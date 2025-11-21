
int value = 0; 



void configureADC() {
  analogSetAttenuation(ADC_11db); 
}

void configureSensorPowerPin() {
  pinMode(POWER_PIN, OUTPUT);
}

void turnSensorOff() {
  digitalWrite(POWER_PIN, LOW);
}

int readWaterSensor() {
  digitalWrite(POWER_PIN, HIGH); 
  delay(10);                     
  int sensorValue = analogRead(SIGNAL_PIN); 
  digitalWrite(POWER_PIN, LOW);  
  return sensorValue;
}

void printSensorValue(int sensorValue) {
  Serial.print("The water sensor value: ");
  Serial.println(sensorValue);
}

bool classifySensorState() {
  value = readWaterSensor();
  printSensorValue(value);
  delay(1000); 
  if (value > WET_THRESHOLD) {
    return true;
  } else {
    return false;
  }
   return false;

}
