const uniqueValidator = require('mongoose-unique-validator')

console.log('Defining Permission Schema')

Provider('Permission', (MongoDBConnection) => {

    var Schema = MongoDBConnection.Schema

    const PermissionSchema = new Schema({
        name: {
            required: true,
            type: String,
            index: true,
            unique: true
        }
    })

    PermissionSchema.plugin(uniqueValidator)
    
    try {
        return MongoDBConnection.model('Permission')
    } catch (e) {
        return MongoDBConnection.model('Permission', PermissionSchema)
    }
})
  