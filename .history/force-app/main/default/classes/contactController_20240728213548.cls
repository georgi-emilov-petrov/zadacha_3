public with sharing class ContactController {
    @AuraEnabled(cacheble=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account];
    }
}