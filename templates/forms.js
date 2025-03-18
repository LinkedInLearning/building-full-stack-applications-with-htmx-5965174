function renderStep1 (errors, values){
    let html = '';

    //Validation Errors
    if(errors.length > 0){
        errors.forEach(errorMessage => {
            html += `
                <div class="alert alert-danger" role="alert">
                    ${errorMessage}
                </div>
            `;
        })
    }
    

    html += `
        <form hx-post="/submit-step1" hx-target="#form-section">
            <div class="mb-3">
                <label class="form-label">First Name</label>
                <input type="text" name="firstName" value="${values.firstName || ''}" class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label">Last Name</label>
                <input type="text" name="lastName" value="${values.lastName || ''}" class="form-control">
            </div>
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="text" name="email" value="${values.email || ''}" class="form-control">
            </div>

            <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary">
                    Next <span class="ms-2">&rarr;</span>
                </button>
            </div>

        </form>
    `;

    return html;

}

function renderStep2(formId, errors, values){

    let html = '';

    //Validation Errors
    if(errors.length > 0){
        errors.forEach(errorMessage => {
            html += `
                <div class="alert alert-danger" role="alert">
                    ${errorMessage}
                </div>
            `;
        })
    }

    html += `
        <form hx-post="/submit-step2" hx-target="#form-section">
            <input type="hidden" name="formId" value="${formId}">
            <div class="mb-3">
                <label class="form-label">Street Address</label>
                <input type="text" name="street" value="${values.street || ''}" class="form-control">
            </div>

            <div class="mb-3">
                <label class="form-label">City</label>
                <input type="text" name="city" value="${values.city || ''}" class="form-control">
            </div>

            <div class="mb-4">
                <label class="form-label">ZIP Code</label>
                <input type="text" name="zip" value="${values.zip || ''}" class="form-control">
            </div>

            <div class="d-flex justify-content-between">
                <!--<button type="button" 
                        hx-get="/" 
                        hx-target="#step2"
                        class="btn btn-outline-secondary">
                    &larr; Previous
                </button>-->
                <button type="submit" class="btn btn-primary">
                    Next &rarr;
                </button>
            </div>
        </form>
    `;

    return html;
}

function renderStep3(formId, errors){
    let html = '';

    html += `
        <form hx-post="/submit-complete-form" hx-target="#form-section">
            <input type="hidden" name="formId" value="${formId}">
            <div class="mb-4">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="newsletter" id="newsletter">
                    <label class="form-check-label" for="newsletter">
                        Subscribe to newsletter
                    </label>
                </div>
                
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="notifications" id="notifications">
                    <label class="form-check-label" for="notifications">
                        Receive notifications
                    </label>
                </div>
            </div>

            <div class="d-flex justify-content-between">
                <!--<button type="button" 
                        hx-get="/step2" 
                        hx-target="#step3"
                        hx-include="[name='formId']"
                        class="btn btn-outline-secondary">
                    &larr; Previous
                </button>-->
                <button type="submit" class="btn btn-success">
                    Submit
                </button>
            </div>

        </form>
    `

    return html;
}

function confirmation(profileData){

    let html = '';

    html += `
        <div class="text-center">
            <h2 class="mb-4">Thank you for submitting!</h2>
            <div class="card">
                <div class="card-body text-start">
                    <h5 class="card-title mb-3">Submitted Data:</h5>
                    <pre class="m-0">${JSON.stringify(profileData, null, 2) }</pre>
                </div>
            </div>
        </div>
    `

    return html;
}

module.exports = {
    renderStep1,
    renderStep2,
    renderStep3,
    confirmation
}