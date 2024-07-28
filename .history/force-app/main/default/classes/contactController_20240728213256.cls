public with sharing class contactController {
    @AuraEnabled(cacheble=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name FROM Account];
    }
}