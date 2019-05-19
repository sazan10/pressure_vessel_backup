export const inputToHead = {"position": {
    "elementType": "select",
    "elementConfig": {
        "type": "select",
        "placeholder": "",
        "options": [
            {
                "displayValue": "bottom",
                "value": "0"
            },
            {
                "displayValue": "top",
                "value": "1"
            }
        ]
    },
    "validation": {
        "required": true
    },
    "label": "Position",
    "value": "0",
    "valid": true
    
}}

export const outputFromHead = {"position": {
    "elementType": "select",
    "elementConfig": {
        "type": "select",
        "placeholder": "",
        "options": [
            {
                "displayValue": "left",
                "value": "0"
            },
            {
                "displayValue": "right",
                "value": "1"
            }
        ]
    },
    "validation": {
        "required": true
    },
    "label": "Position",
    "value": "0",
    "valid": true
    
}  }

export const newData = {
    ip: "400"
}

export const oldData = {
    "ip": {
        "elementType": "input",
        "elementConfig": {
            "type": "input",
            "placeholder": "300 Kpsi"
        },
        "validation": {
            "required": true
        },
        "value": "300",
        "label": "Internal Pressure (Kpsi)",
        "step": "any",
        "valid": true
    }
}

export const outputData = {
    "ip": {
        "elementType": "input",
        "elementConfig": {
            "type": "input",
            "placeholder": "300 Kpsi"
        },
        "validation": {
            "required": true
        },
        "value": "400",
        "label": "Internal Pressure (Kpsi)",
        "step": "any",
        "valid": true
    }
}

export const distance = {
    distance: {
      elementType: "input",
      elementConfig: {
        type: "input"
      },
      validation: {
        required: true
      },
      placeholder: "0",
      value: "10",
      label: "Distance from CG",
      valid: true
    }
  }