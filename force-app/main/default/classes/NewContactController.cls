public with sharing class NewContactController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account];
    }

    @AuraEnabled
    public static void saveContact(
        String name,
        String email,
        String phone,
        Id accountId
    ) {
        Contact newContact = new Contact();
        newContact.LastName = name;
        newContact.Email = email;
        newContact.Phone = phone;
        newContact.AccountId = accountId;
        try {
            insert newContact;
        } catch (Exception e) {
            throw new AuraHandledException(
                'Error saving contact: ' + e.getMessage()
            );
        }
    }
}
