import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } 
    from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
    from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBFTTYRyRIKSt6xAmYtn07mwwKxa_Pd4Ww",
    authDomain: "customer-invoice-registration.firebaseapp.com",
    projectId: "customer-invoice-registration",
    storageBucket: "customer-invoice-registration.appspot.com",
    messagingSenderId: "340077803058",
    appId: "1:340077803058:web:5dea0f000d8a4898b8f6e2"
};

// init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// form submit
document.getElementById("invoiceForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const invoiceId = document.getElementById("invoiceId").value;
    const file = document.getElementById("invoiceImage").files[0];

    const fileName = `${invoiceId}_${Date.now()}`;
    const imageRef = ref(storage, "invoices/" + fileName);

    // Upload
    await uploadBytes(imageRef, file);

    // URL
    const imageUrl = await getDownloadURL(imageRef);

    // Save to Firestore
    await addDoc(collection(db, "invoices"), {
        Fullname: fullName,
        phone: phone,
        invoiceId: invoiceId,
        imageUrl: imageUrl,
        createdAt: serverTimestamp()
    });

    alert("Invoice submitted successfully!");
});
