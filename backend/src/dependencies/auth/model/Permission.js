const mongoose = require('mongoose')

Provider('Permission', (MongoDBConnection) => {

    var Schema = MongoDBConnection.Schema

    const PermissionSchema = new Schema({
        name: {
            required: true,
            type: String
        }
    })
    
    PermissionSchema.path('name').validate(async (value) => {
        const count = await mongoose.models.Permission.countDocuments({ name: value })
        return !count
    }, 'Permission already exists')

    return MongoDBConnection.model('Permission', PermissionSchema)
})
  