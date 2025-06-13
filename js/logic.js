const form = document.getElementById("AdvancedForm");
const fields = form.querySelectorAll("input, select, textarea");
const btnSubmit = document.getElementById("btnSubmit");

let validationStatus = {};

// Inicializar estado de validación para todos los campos
fields.forEach((field) => {
    validationStatus[field.name] = false;
});

// Validación de nombres
document.getElementById("names").addEventListener("input", function () {
    const value = this.value.trim();
    const names = value.split(" ").filter((name) => name.length > 0);

    if (value.length < 3) {
        showError("errorNames", "El nombre debe tener al menos 3 caracteres");
        markField(this, false);
    } else if (names.length < 2) {
        showError("errorNames", "Ingrese al menos 2 nombres");
        markField(this, false);
    } else {
        showSuccess("successNames", "✓ Nombre válido");
        markField(this, true);
    }
});

// Validación de apellidos
document.getElementById("lastNames").addEventListener("input", function () {
    const value = this.value.trim();
    const lnames = value.split(" ").filter((lname) => lname.length > 0);

    if (value.length < 3) {
        showError("errorLastNames", "El apellido debe tener al menos 3 caracteres");
        markField(this, false);
    } else if (lnames.length < 2) {
        showError("errorLastNames", "Ingrese al menos 2 apellidos");
        markField(this, false);
    } else {
        showSuccess("successLastNames", "✓ Apellido válido");
        markField(this, true);
    }
});

// Validación de email
document.getElementById("email").addEventListener("input", function () {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(this.value)) {
        showError("errorEmail", "El correo no es válido");
        markField(this, false);
    } else {
        showSuccess("successEmail", "✓ Correo válido");
        markField(this, true);
    }
    
    // Revalidar confirmación de email si existe
    const confirmEmail = document.getElementById("confirmEmail");
    if (confirmEmail.value) {
        confirmEmail.dispatchEvent(new Event("input"));
    }
});

// Validación de confirmación de email
document.getElementById("confirmEmail").addEventListener("input", function () {
    const email = document.getElementById("email").value;
    
    if (this.value !== email) {
        showError("errorConfirmEmail", "Los correos no coinciden");
        markField(this, false);
    } else if (this.value.length > 0) {
        showSuccess("successConfirmEmail", "✓ Correos coinciden");
        markField(this, true);
    } else {
        showError("errorConfirmEmail", "Confirme su correo electrónico");
        markField(this, false);
    }
});

// Validación de contraseña con indicador de fortaleza
document.getElementById("password").addEventListener("input", function () {
    const password = this.value;
    const fortress = calculateFortressPassword(password);
    updateFortress(fortress);
    
    if (password.length < 8) {
        showError("errorPassword", "La contraseña debe tener al menos 8 caracteres");
        markField(this, false);
    } else if (fortress.level < 2) {
        showError("errorPassword", "Contraseña muy débil. Añada números y símbolos");
        markField(this, false);
    } else {
        showSuccess("successPassword", `✓ Contraseña ${fortress.text}`);
        markField(this, true);
    }
    
    // Revalidar confirmación si existe
    const confirmPassword = document.getElementById("confirmPassword");
    if (confirmPassword.value) {
        confirmPassword.dispatchEvent(new Event("input"));
    }
});

// Validación de confirmación de contraseña
document.getElementById("confirmPassword").addEventListener("input", function () {
    const password = document.getElementById("password").value;
    
    if (this.value !== password) {
        showError("errorConfirmPassword", "Las contraseñas no coinciden");
        markField(this, false);
    } else if (this.value.length > 0) {
        showSuccess("successConfirmPassword", "✓ Contraseñas coinciden");
        markField(this, true);
    } else {
        showError("errorConfirmPassword", "Confirme su contraseña");
        markField(this, false);
    }
});

// Validación del teléfono con formato automático
document.getElementById("phone").addEventListener("input", function () {
    // Aplicar formato automático
    let value = this.value.replace(/\D/g, "");
    if (value.length >= 6) {
        value = value.substring(0, 3) + "-" + value.substring(3, 6) + "-" + value.substring(6, 10);
    } else if (value.length >= 3) {
        value = value.substring(0, 3) + "-" + value.substring(3);
    }
    this.value = value;
    
    const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    if (!phoneRegex.test(value)) {
        showError("errorPhone", "Formato: 300-123-4567");
        markField(this, false);
    } else {
        showSuccess("successPhone", "✓ Teléfono válido");
        markField(this, true);
    }
});

// Validación de fecha de nacimiento
document.getElementById("birthdate").addEventListener("change", function () {
    const birthdate = new Date(this.value);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    
    // Ajustar edad si no ha cumplido años este año
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    
    if (age < 18) {
        showError("errorBirthdate", "Debes ser mayor de 18 años");
        markField(this, false);
    } else if (age > 100) {
        showError("errorBirthdate", "Fecha no válida");
        markField(this, false);
    } else {
        showSuccess("successBirthdate", `✓ Edad: ${age} años`);
        markField(this, true);
    }
});

// Contador de caracteres para comentarios
document.getElementById("comments").addEventListener("input", function () {
    const counter = document.getElementById("charCount");
    counter.textContent = this.value.length;
    
    if (this.value.length > 450) {
        counter.style.color = "#dc3545";
    } else if (this.value.length > 400) {
        counter.style.color = "#ffc107";
    } else {
        counter.style.color = "#666";
    }
    
    markField(this, true); // Los comentarios son opcionales
});

// Validación de términos
document.getElementById("terms").addEventListener("change", function () {
    if (!this.checked) {
        showError("errorTerms", "Debes aceptar los términos y condiciones");
        markField(this, false);
    } else {
        hideMessage("errorTerms");
        markField(this, true);
    }
});

// Funciones de utilidad
function showError(idElement, message) {
    const element = document.getElementById(idElement);
    if (element) {
        element.textContent = message;
        element.style.display = "block";
        hideMessage(idElement.replace("error", "success"));
    }
}

function showSuccess(idElement, message) {
    const element = document.getElementById(idElement);
    if (element) {
        element.textContent = message;
        element.style.display = "block";
        hideMessage(idElement.replace("success", "error"));
    }
}

function hideMessage(idElement) {
    const element = document.getElementById(idElement);
    if (element) {
        element.style.display = "none";
    }
}

function markField(field, isValid) {
    validationStatus[field.name] = isValid;
    
    if (isValid) {
        field.classList.remove("invalido");
        field.classList.add("valido");
    } else {
        field.classList.remove("valido");
        field.classList.add("invalido");
    }
    
    updateProgress();
    updateButton();
}

function calculateFortressPassword(password) {
    let points = 0;
    
    if (password.length >= 8) points++;
    if (password.length >= 12) points++;
    if (/[a-z]/.test(password)) points++;
    if (/[A-Z]/.test(password)) points++;
    if (/[0-9]/.test(password)) points++;
    if (/[^A-Za-z0-9]/.test(password)) points++;
    
    const levels = ["muy débil", "débil", "media", "fuerte", "muy fuerte"];
    const level = Math.min(Math.floor(points / 1.2), 4);
    
    return { level, text: levels[level], points };
}

function updateFortress(fortress) {
    const bar = document.getElementById("strengthBar");
    const classes = [
        "strength-weak",
        "strength-weak", 
        "strength-medium",
        "strength-strong",
        "strength-very-strong"
    ];
    
    bar.className = "password-strength " + classes[fortress.level];
    bar.style.width = ((fortress.level + 1) * 20) + "%";
}

function updateProgress() {
    const totalFields = Object.keys(validationStatus).length;
    const validFields = Object.values(validationStatus).filter(valid => valid).length;
    const percentage = Math.round((validFields / totalFields) * 100);
    
    document.getElementById("barProgress").style.width = percentage + "%";
    document.getElementById("percentageProgress").textContent = percentage + "%";
}

function updateButton() {
    const allValid = Object.values(validationStatus).every(valid => valid);
    btnSubmit.disabled = !allValid;
}

// Manejo del envío del formulario
form.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const dataForm = new FormData(this);
    let resumeHTML = "<h3>Resumen de datos enviados:</h3>";
    
    for (let [field, value] of dataForm.entries()) {
        if (value && value.trim() !== "" && field !== "password" && field !== "confirmPassword") {
            const nameField = getNameField(field);
            resumeHTML += `
                <div class="data-resume">
                    <span class="label-resume">${nameField}:</span> ${value}
                </div>
            `;
        }
    }
    
    // Crear elemento de resumen si no existe
    let resumeElement = document.getElementById("dataResume");
    if (!resumeElement) {
        resumeElement = document.createElement("div");
        resumeElement.id = "dataResume";
        resumeElement.style.cssText = `
            margin-top: 20px;
            padding: 20px;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            display: none;
        `;
        form.parentNode.appendChild(resumeElement);
    }
    
    resumeElement.innerHTML = resumeHTML + `
        <button type="button" onclick="resetForm()" style="margin-top: 15px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Enviar otro formulario
        </button>
    `;
    
    resumeElement.style.display = "block";
    
    // Scroll suave hacia el resumen
    resumeElement.scrollIntoView({ behavior: "smooth" });
    
    console.log("📊 Formulario enviado con validación completa:", Object.fromEntries(dataForm));
});

function getNameField(field) {
    const names = {
        names: "Nombres",
        lastNames: "Apellidos", 
        email: "Correo electrónico",
        confirmEmail: "Confirmación de correo",
        password: "Contraseña",
        confirmPassword: "Confirmación de contraseña",
        phone: "Teléfono",
        birthdate: "Fecha de nacimiento",
        comments: "Comentarios",
        terms: "Términos aceptados"
    };
    
    return names[field] || field;
}

function resetForm() {
    form.reset();
    
    const resumeElement = document.getElementById("dataResume");
    if (resumeElement) {
        resumeElement.style.display = "none";
    }
    
    // Reiniciar estado de validación
    Object.keys(validationStatus).forEach(field => {
        validationStatus[field] = false;
    });
    
    // Limpiar clases y mensajes
    fields.forEach(field => {
        field.classList.remove("valido", "invalido");
    });
    
    document.querySelectorAll(".message-error, .message-success").forEach(message => {
        message.style.display = "none";
    });
    
    // Reiniciar contador de caracteres
    document.getElementById("charCount").textContent = "0";
    document.getElementById("charCount").style.color = "#666";
    
    updateProgress();
    updateButton();
    
    // Limpiar barra de fortaleza
    const strengthBar = document.getElementById("strengthBar");
    strengthBar.className = "password-strength";
    strengthBar.style.width = "0%";
    
    // Enfocar el primer campo
    document.getElementById("names").focus();
}