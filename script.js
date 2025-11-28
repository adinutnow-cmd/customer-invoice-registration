// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
    getFirestore, collection, addDoc, getDocs, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
    getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBFTTYrRyIKSt6xAmYtn7omwwKxa_Pd4Ww",
  authDomain: "customer-invoice-registration.firebaseapp.com",
  projectId: "customer-invoice-registration",
  storageBucket: "customer-invoice-registration.firebasestorage.app",
  messagingSenderId: "340077803058",
  appId: "1:340077803058:web:5deaf000d8a4898b8f6e2b"
};


// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);


// ------------------------
// USER PAGE (index.html)
// ------------------------
const form = document.getElementById("invoiceForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value;
        const phone = document.getElementById("phone").value;
        const invoiceId = document.getElementById("invoiceId").value;
        const file = document.getElementById("invoiceImage").files[0];

        const statusEl = document.getElementById("status");

        try {
            const fileName = `${invoiceId}_${Date.now()}`;
            const storageRef = ref(storage, "invoices/" + fileName);

            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            await addDoc(collection(db, "invoices"), {
                fullname: fullName,
                phone: phone,
                invoiceId: invoiceId,
                imageUrl: downloadURL,
                createdAt: serverTimestamp()
            });

            statusEl.textContent = "Invoice submitted successfully.";
            statusEl.style.color = "green";
            form.reset();

        } catch (err) {
            console.error(err);
            statusEl.textContent = "Error submitting invoice.";
            statusEl.style.color = "red";
        }
    });
}


// ------------------------
// ADMIN PAGE (admin.html)
// ------------------------
const tableBody = document.querySelector("#invoiceTable tbody");

if (tableBody) {
    async function loadInvoices() {
        const snap = await getDocs(collection(db, "invoices"));
        snap.forEach((doc) => {
            const data = doc.data();

            const row = `
                <tr>
                    <td>${data.fullname}</td>
                    <td>${data.phone}</td>
                    <td>${data.invoiceId}</td>
                    <td><a href="${data.imageUrl}" target="_blank">
                        <img src="${data.imageUrl}">
                    </a></td>
                    <td>${data.createdAt?.toDate?.() || ""}</td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });
    }

    loadInvoices();
}

