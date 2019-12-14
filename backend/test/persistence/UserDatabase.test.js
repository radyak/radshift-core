var chai = require('chai')
var expect = chai.expect
var UserDatabase = require('../../src/dependencies/persistence/UserDatabase')


const userDatabase = new UserDatabase()


describe('User Database', () => {

    it('should validate user names', () => {

        // no empty user names
        expect(() => userDatabase.checkUsername()).to.throw()
        expect(() => userDatabase.checkUsername('')).to.throw()

        // no spaces
        expect(() => userDatabase.checkUsername('    ')).to.throw()
        expect(() => userDatabase.checkUsername('some username')).to.throw()
        expect(() => userDatabase.checkUsername('    some.username')).to.throw()
        expect(() => userDatabase.checkUsername('some.username   ')).to.throw()
        expect(() => userDatabase.checkUsername('some.username   ')).to.throw()

        // 2 characters -> too short
        expect(() => userDatabase.checkUsername('me')).to.throw()

        // 33 characters -> too long
        expect(() => userDatabase.checkUsername('memememememememememememememememem')).to.throw()

        // Special chars:
        expect(() => userDatabase.checkUsername('user+name')).to.throw()
        expect(() => userDatabase.checkUsername('ußer.name')).to.throw()
        expect(() => userDatabase.checkUsername('user(me)name')).to.throw()
        expect(() => userDatabase.checkUsername('u$er.name')).to.throw()
        expect(() => userDatabase.checkUsername('user.name!')).to.throw()


        // Valid: May contain a-z, A-Z, 0-9 and -_@
        expect(() => userDatabase.checkUsername('val1d.User_name@')).to.not.throw()
    })


    it('should validate passwords', () => {

        // no empty passwords
        expect(() => userDatabase.checkPassword()).to.throw()
        expect(() => userDatabase.checkPassword('')).to.throw()

        // no spaces
        expect(() => userDatabase.checkPassword('    ')).to.throw()
        expect(() => userDatabase.checkPassword('Ex4mple pa$sword')).to.throw()

        // 7 characters -> too short (and not all char groups)
        expect(() => userDatabase.checkUsername('p4$W0rd')).to.throw()

        // 129 characters -> too long
        expect(() => userDatabase.checkPassword('Example-p4sswordExample-p4sswordExample-p4sswordExample-p4sswordExample-p4sswordExample-p4sswordExample-p4sswordExample-p4ssword1')).to.throw()

        // Contains only 3 of the groups: a-z, A-Z, 0-9, !@#$%^&*
        expect(() => userDatabase.checkPassword('ex4mple-pa$sword')).to.throw() // No A-Z
        expect(() => userDatabase.checkPassword('EX4MPLE-PA$SWORD')).to.throw() // No a-z
        expect(() => userDatabase.checkPassword('ExAmple-pa$sword')).to.throw() // No 0-9
        expect(() => userDatabase.checkPassword('Ex4mplepaSsword')).to.throw() // No special chars

        
        // Valid: Must contain 1 of each: a-z, A-Z, 0-9 and !@#$%^&*
        expect(() => userDatabase.checkPassword('Ex4mple-pa$sword')).not.to.throw()
        
    })


    it('should validate permissions', () => {

        // empty permissions
        expect(() => userDatabase.checkPermissions()).not.to.throw()
        expect(() => userDatabase.checkPermissions([])).not.to.throw()
        
        // Notizes Invalid permission no matter which place
        expect(() => userDatabase.checkPermissions(['s@m3', 'r4Nd0m', 'pErMi5sion5'])).to.throw()
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4Nd@m', 'pErMi5sion5'])).to.throw()
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4Nd0m', 'pErMi5si@n5'])).to.throw()
        
        // Special chars:
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4+d0m', 'pErMi5sion5'])).to.throw()
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4öd0m', 'pErMi5sion5'])).to.throw()
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4Nd0m', 'pErMi5ßion5'])).to.throw()
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4(N)d0m', 'pErMi5sion5'])).to.throw()
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4Nd0m', 'pErMi5$ion5'])).to.throw()
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4Nd0m!', 'pErMi5sion5'])).to.throw()
        
        // 2 characters -> too short
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4', 'pErMi5sion5'])).to.throw()

        // 33 characters -> too long
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4Nd0mr4Nd0mr4Nd0mr4Nd0mr4Nd0mr4N', 'pErMi5sion5'])).to.throw()

        // No empty permissions:
        expect(() => userDatabase.checkPermissions(['sOm3', '', 'pErMi5sion5'])).to.throw()

        // No spaces:
        expect(() => userDatabase.checkPermissions(['sOm3', ' r4Nd0m', 'pErMi5sion5'])).to.throw()
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4N d0m', 'pErMi5sion5'])).to.throw()
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4Nd0m ', 'pErMi5sion5'])).to.throw()


        // Valid: May contain a-z, A-Z, 0-9 and -_@
        expect(() => userDatabase.checkPermissions(['sOm3', 'r4Nd0m', 'pErMi5sion5'])).not.to.throw()
        
    })

})