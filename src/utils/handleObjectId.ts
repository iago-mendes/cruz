import ObjectID from 'bson-objectid'

export function handleObjectId(_id?: string)
{
	if (!_id || _id.length !== 24)
		return String(new ObjectID())
	
	return String(new ObjectID(_id))
}