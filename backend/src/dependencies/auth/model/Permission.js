const uniqueValidator = require('mongoose-unique-validator')

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
    
    return MongoDBConnection.model('Permission', PermissionSchema)
})
  