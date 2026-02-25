MFA = 多重因素驗證（Multi-Factor Authentication）

**MFA（Multi-Factor Authentication）** 是一種安全機制，登入時除了密碼，還需要「至少兩種不同類型的驗證方式」，提升帳號安全性。

---

## 🔐 三種常見驗證因素

1️⃣ **你知道的東西（Something you know）**

* 密碼
* PIN 碼

2️⃣ **你擁有的東西（Something you have）**

* 手機簡訊驗證碼（SMS OTP）
* 驗證 App（如 Google Authenticator、Microsoft Authenticator）
* 硬體安全金鑰（如 Yubico 的 YubiKey）

3️⃣ **你本身的特徵（Something you are）**

* 指紋
* 臉部辨識
* 虹膜辨識

---

## 🔎 為什麼要用 MFA？

如果只有密碼：

👉 密碼外洩 = 帳號直接被入侵

有 MFA：

👉 就算密碼外洩
👉 攻擊者還需要你的手機 / 指紋 / 實體金鑰
👉 入侵難度大幅提升

---

## 🧠 常見使用場景

* GitHub 登入
* 雲端服務（AWS、Azure）
* 公司 VPN
* 銀行 App

---

## 🔥 舉例

登入 GitHub：

1. 輸入帳號密碼
2. 再輸入驗證 App 產生的 6 位數一次性密碼

這就是 MFA。
