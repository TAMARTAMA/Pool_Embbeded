#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 5    
#define RST_PIN 4 

MFRC522 rfid(SS_PIN, RST_PIN);

String knownTags[] = {
  "A1 B2 C3 D4", 
  "11 22 33 44"
  
};

void InitRFID() {
  SPI.begin();
  rfid.PCD_Init(); 
  Serial.println("RFID system ready");
}

String activateRFID() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) {
    return "NO";
  }

  String tagID = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    tagID += String(rfid.uid.uidByte[i], HEX);
    if (i < rfid.uid.size - 1) tagID += " ";
  }
  tagID.toUpperCase();
  Serial.print("Tag read: ");
  Serial.println(tagID);

  return tagID;
}

void deactivateRFID() {
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

bool isKnownTag(String tag) {
  for (String known : knownTags) {
    if (known == tag) {
      return true;
    }
  }
  return false;
}

