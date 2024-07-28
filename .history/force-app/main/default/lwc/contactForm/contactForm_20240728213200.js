import { LightningElement, wire } from 'lwc';

export default class ContactForm extends LightningElement {
    name = '';
    email = '';
    phone = '';
    selectedAccount = '';
    accountOptions = [];

    @wire()



}