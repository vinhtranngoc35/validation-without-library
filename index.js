

function createInput(props) {
    return `<div class="${props.classContainer || ''}">
                <label class="${props.classLabel || ''}">${props.label}</label>
                <input class="input-custom form-control ${props.classInput || ''}" 
                type="${props.type || 'text'}" name="${props.name}"
                ${props.pattern ? `pattern="${props.pattern}"` : ""} 
                value="${props.value}"
                ${props.require ? 'required' : ''} 
                />
                <span class="error ${props.classError}">${props.message}</span>
            </div>`
}

function createSelect(props) {
    let optionsStr = "";
    props.options.forEach(e => {

        if (e.value == props.value) {
            optionsStr += `<option value="${e.value}" selected>${e.name}</option>`;
        } else {
            optionsStr += `<option value="${e.value}">${e.name}</option>`;
        }
    })

    return `<div "${props.classContainer || ''}">
                <label class="${props.classLabel || ''}">${props.label}</label>
                <select class="input-custom form-control ${props.classSelect || ''}" 
                type="${props.type || 'text'}" name="${props.name}" 
                ${props.pattern ? `pattern=${props.pattern}` : ""} 
                value="${props.value}"
                ${props.require ? 'required' : ''}>
                    <option value>---Choose---</option>
                    ${optionsStr}
                </select>
                <span class="error ${props.classError}">${props.message}</span>
            </div>`
}

function createFieldForm(props) {
    if (props.type === 'select') {
        return createSelect(props);
    }
    return createInput(props);
}






const onFocus = (formBody, index) => {
    const inputsForm = formBody.querySelectorAll('.input-custom')
    inputsForm[index].setAttribute("focused", "true"); // add 1 attribute focused=true.
}


function renderForm(formBody, inputs) {

    formBody.innerHTML = ""; //clear ô input cũ
    inputs.forEach((input) => {
        formBody.innerHTML += createFieldForm(input); //gen từng ô input mới
    })

    const inputElemments = formBody.querySelectorAll('.input-custom');

    // add sự kiện onFocus
    for (let i = 0; i < inputElemments.length; i++) {
        inputElemments[i].onblur = function () {
            onFocus(formBody, i)
            validateInput(inputs.at(i), inputElemments[i], i)
        }
        inputElemments[i].oninput = function () {
            validateInput(inputs.at(i), inputElemments[i], i)

        }
    }

}
document.addEventListener('invalid', (function () {
    return function (e) {
        e.preventDefault(); // chặn popup của html5
        e.target.onblur(); // call onblur của tất cả các ô input
    };
})(), true);

function validateInput(inputProp, inputElement, index) {
    const { validate, messageRequire, message, messageCustom } = inputProp;
    const error = document.getElementsByClassName('error')[index];
    const value = inputElement.value.trim();



    if (inputElement.required && value === '') {
        error.innerHTML = messageRequire || 'This field is required!';
        return;
    }
    if (!validate) return;
    const isValid = validate(value);
    error.innerHTML = isValid ? message : messageCustom;
}
function getDataFromForm(event) {
    event.preventDefault()
    const data = new FormData(form);
    return Object.fromEntries(data.entries())
}

const formBody = document.querySelector('#formBody');

const inputs = [
    {
        label: "Username",
        name: "username",
        pattern: "^[A-Za-z ]{6,20}",
        message: "Username must have minimun is 6 charaters and maximun is 20 charaters",
        require: false,
        value: ""
    },
    {
        label: "Email",
        name: "email",
        type: "email",
        message: "Email invalid",
        require: true,
        value: "",
        validate: (value) => {
            if (value.length < 3) {
                return false;
            }
            return true;
        },
        messageCustom: "Trên 3 ký tự",
        messageRequire: "Nhập đê"
    },
    {
        label: "Gender",
        name: "gender",
        type: "select",
        require: true,
        message: "Gender invalid",
        options: [{ value: 1, name: 'Male' }, { value: 2, name: 'Female' }]
    }
];
renderForm(formBody, inputs);

function getDataFromForm(event, formDemo) {
    event.preventDefault()
    const data = new FormData(formDemo);
    return Object.fromEntries(data.entries())
}
const form = document.querySelector('#form');
form.onsubmit = (event) => {
    console.log(getDataFromForm(event, form));
};
