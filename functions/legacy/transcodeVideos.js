var AWS = require('aws-sdk'),
    transcoder = new AWS.ElasticTranscoder({
        apiVersion: '2012-09-25',
        region: 'us-east-1'
    });
 
exports.handler = (event, context, callback) => {
    let fileName = event.Records[0].s3.object.key;
    console.log('New video has been uploaded:', fileName);
 
    transcoder.createJob({
    	PipelineId: process.env.PIPELINE_ID,
    	Input: {
    		Key: fileName,
    		FrameRate: 'auto',
    		Resolution: 'auto',
    		AspectRatio: 'auto',
    		Interlaced: 'auto',
    		Container: 'auto'
    	},
    	Output: {
    		Key: fileName,
    		ThumbnailPattern: 'thumbnails/' + fileName + '-{count}',
    		PresetId: '1351620000001-100020',
    		Rotate: 'auto'
    	}
    }, function(err, data){
        if(err){
            console.log('Something went wrong:',err)
        }else{
            console.log('Converting is done');
        }
    	callback(err, data);
    });
};