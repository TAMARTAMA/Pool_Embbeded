void setupSensor() {
  if (!particleSensor.begin(Wire, I2C_SPEED_STANDARD)) {
    Serial.println("לא הצליח לאתחל את MAX30102");
    while (1);
  }

  particleSensor.setup();  
  particleSensor.setPulseAmplitudeRed(0x0A);   
  particleSensor.setPulseAmplitudeGreen(0);    
  Serial.println("MAX30102 מופעל");
}

void shutdownSensor() {
  particleSensor.shutDown();
  Serial.println("MAX30102 נכבה");
}

bool isFingerOnSensor(long irValue) {
  return irValue > 50000;  
}

void readVitals() {
  long irValue = particleSensor.getIR();

  if (checkForBeat(irValue)) {
    static unsigned long lastBeat = 0;
    unsigned long delta = millis() - lastBeat;
    lastBeat = millis();

    bpm = 60.0 / (delta / 1000.0);
    Serial.print("BPM: ");
    Serial.println(bpm);
  }   

  Serial.print("דופק: ");
  Serial.print(bpm);
}

String evaluateSensorState(float bpm) {
  if (bpm == 0 ) {
    return "SIGNAL_LOST";
  }
  if (bpm < 40) {
    return "LOW_PULSE";
  }
  if (bpm > 120) {
    return "HIGH_PULSE";
  }

  return "NORMAL";
}

