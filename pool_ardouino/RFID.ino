#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 5    // ניתן לשנות לפי חיבור
#define RST_PIN 4 

MFRC522 rfid(SS_PIN, RST_PIN);

String knownTags[] = {
  "A1 B2 C3 D4", // דוגמאות לצ'יפים שמוכרים מראש
  "11 22 33 44"
  
};

void InitRFID() {
  SPI.begin();
  rfid.PCD_Init(); // אתחול החיישן
  Serial.println("RFID system ready");
}

// מדליקה את החיישן ומחזירה UID שנקרא או מחרוזת ריקה
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

// מכבה את החיישן
void deactivateRFID() {
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

// בודקת האם ה־tagID נמצא ברשימת תגיות מוכרות
bool isKnownTag(String tag) {
  for (String known : knownTags) {
    if (known == tag) {
      return true;
    }
  }
  return false;
}
