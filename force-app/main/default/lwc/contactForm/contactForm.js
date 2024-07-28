import { LightningElement, wire } from "lwc";
import getAccounts from "@salesforce/apex/NewContactController.getAccounts";
import saveContact from "@salesforce/apex/NewContactController.saveContact";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ContactForm extends LightningElement {
    name = "";
    email = "";
    phone = "";
    selectedAccount = "";
    accountOptions = [];

    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accountOptions = data.map((account) => ({
                label: account.Name,
                value: account.Id
            }));
        } else if (error) {
            console.error("Error fetching accounts:", error);
        }
    }

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handlePhoneChange(event) {
        this.phone = event.target.value;
    }

    handleAccountChange(event) {
        this.selectedAccount = event.target.value;
    }

    handleCreate() {
        saveContact({
            name: this.name,
            email: this.email,
            phone: this.phone,
            accountId: this.selectedAccount
        })
            .then(() => {
                this.dispatchEvent(new CustomEvent("contactcreated"));
                this.showToast(
                    "Success",
                    "Contact created successfully!",
                    "success"
                );
                this.handleCancel();
            })
            .catch((error) => {
                this.showToast(
                    "Error",
                    "Error creating contact: " + error.body.message,
                    "error"
                );
            });
    }

    handleCancel() {
        this.name = "";
        this.email = "";
        this.phone = "";
        this.selectedAccount = "";
        this.dispatchEvent(new CustomEvent("cancel"));
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(event);
    }
}
