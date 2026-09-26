# JETSON — yeni oturuma yapıştır

Bunu ilk mesaj yap. Başka isim arama. LONG 500’e dokunma.

Kullanıcı Türkçe konuşur. Site, X, ticker İngilizce. Kısa cevap. AI CTO. CA gelince sorusuz yapıştır.

Bu dosyada anahtar, PAT, Vercel token yok. Varsa sohbete de yapıştırma. Eski sohbette `ghp_` / `vcp_` geçtiyse **rotate et**.

---

## Ne

Jetson, NVIDIA’nın küçük kenar bilgisayarı. Coin o ürünün kendisi değil. Çizgi film değil. JetBot reposunun karakteri değil.

Bizim tahta orijinal: bir kamera gözü, pinlerden ağız, pembe mavi sarı kablo. Cümle: **The little computer.**

long.xyz’de **NVDAx3L** çiftine konacak. Ticker **$JETSON**. 3×.

| | |
|---|---|
| İsim | Jetson |
| Ticker | `$JETSON` |
| Domain | jetson.lol — 26 Eyl 2026 kontrolünde SSL açılmadı |
| Canlı site | https://jetson-lemon.vercel.app — 200 |
| Vercel | takım **telefork**, proje **jetson** |
| Repo | https://github.com/teleforkXYZ/jetson (`main`, public) |
| Commit | `348f380` site, `fe5ee50` X kiti |
| Pair | NVDAx3L |
| Pair adresi | `0xF51fb54DE60f6e16252E852A5Ed0E60B8307606A` |
| Pair sayfası | https://app.long.xyz/longx/0xF51fb54DE60f6e16252E852A5Ed0E60B8307606A |
| Token CA | yok |
| X | hesap kullanıcıda. Görseller repoda `x-kit/` |

İsim NVIDIA org taramasından geldi, tek bir maskot reposundan değil. Ürün sayfası: https://developer.nvidia.com/embedded/jetson-developer-kits  
Pin kütüphanesi: https://github.com/NVIDIA/jetson-gpio  
Robot (bizim değil): https://github.com/NVIDIA-AI-IOT/jetbot

NVIDIA fotoğrafını ve logosunu siteye yapıştırma.

---

## Sitede ne var

Repo `src/lib/site.ts` kilitli kimlik. Sayfa:

- Üst: `$JETSON` ve `jetson.lol`
- Kayan şerit: ticker, domain, `3× NVDAx3L`, the little computer
- Başlık Jetson. Altı: One camera eye, a mouth of pins, arms made of wire.
- Tahta: `boot.jpg` yanıyor, `idle.jpg` uyuyor. Buton **Boot / Power down**. Üç lamba: Lime, Coral, Sky.
- Üç kart: One eye, Pins, Wires.
- Tam genişlik `jump.jpg`
- Kayıt: NVIDIA’nın sitesi değil. Vault adresi yazılı. “No coin contract yet.”

CA kutusu yok. LONG 500’deki gibi bir kutu ekle. Boşken adres uydurma. Vault adresini CA sanma. O, NVDAx3L longx kasası.

Görseller: `public/jetson/idle.jpg`, `boot.jpg`, `jump.jpg`. X: `x-kit/x-logo.jpg`, `x-banner.jpg`, `x-post.jpg`.

---

## Nasıl aç

Bu oturumun klasörü LONG 500’dür. Üstüne Jetson yazma.

1. `teleforkXYZ/jetson` reposunu ayrı klasöre klonla.
2. Vercel projesi **jetson**. `long500` projesine deploy etme.
3. `jetson.lol` DNS. Apex ve `www` ayrı sertifika. LONG 500’de çalışan model: Vercel’in o an verdiği A kayıtları, apex çoğu zaman `www`’ye 308. İlk açılmama tarayıcı önbelleği olabilir. Gizli pencerede dene.
4. long.xyz’de pair **NVDAx3L**. İsim Jetson. Ticker JETSON. Fee, yüzde, kasa vaadi yazma. long.xyz vergisi protokolün.
5. CA gelince site kutusuna olduğu gibi yapıştır, soru sorma, production’a bas. LONG 500 adresi `0xf55bb237ecc10cfe2fbaf62a61f95ceb03691e18` bu kutuya girmez.
6. X: isim Jetson. Bio kısa İngilizce. İlk post + `x-kit/x-post.jpg`. CA satırını kullanıcı ekler.

---

## Önceki masadan kalan

Pad değişti. Eski iş **letscash.fun**, ETH, vergi, vault, Remix. Jetson’da o yok. Dersler:

- TanStack Start preset. Vercel’de Other seçme.
- www kanonik düşün. Apex ve www ayrı sertifika. `http://` kırmızı kilit yapar.
- CA gelmeden adres yazma. Gelince kontrol etme, yapıştır.
- Kapalı ticker’ı yeniden önerme: CLIP, GOTCHI, CATFACT, SIMIAN, CHAOS, HOOD100, TILL.
- Bu turda da bırakılanlar: DOGCAT, REXJET, NEMOCLAW, SPX, FIVEHUNDRED, LONG500, PVE, STONKS, WITCH. SPY ticker olmaz, o hissenin adı.
- Başka şirketin logosu, köpek, çizgi film. “Telif bende” bunu değiştirmez.
- Eski remote’a basma. Jetson remote’u yalnız `teleforkXYZ/jetson`.
- GitHub geçmişine özel ek, eski attachment, token koyma.
- Duyuru kısa, İngilizce, bir görsel. Rakip isim yok.

Sıra duygusu, karıştırma:

| | |
|---|---|
| Canlı, dokunma | LONG 500 · `$SPXD` · SPY · https://www.long500.xyz · CA `0xf55bb237ecc10cfe2fbaf62a61f95ceb03691e18` |
| Sıradaki | Jetson |
| Karışmasın | MEOWTON long · AAPL · meowton.lol |
| Site var, CA yok, sırada değil | Gigatrace `$GIGA` ANTHROPICx1L · Scone Bench `$SCONE` aynı çift |
| LetsCash kapandı | ClipStock, Moodymann, Meogen, KILI, Cat-Astrophe, Catris, Catculus, BRICS+ |

---

## İlk iş

Klonla. `jetson.lol` DNS’ini bağla. CA kutusunu boş koy. Deploy’u jetson projesine bas. Token’ı kullanıcı long.xyz’de açacak.
