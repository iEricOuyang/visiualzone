export default {
  url: '/jiulongpo/caseinfo/:type/:domainId/:startTime/:endTime',
  mock: {
    'code': 1,
    'msg': 'success',
    'result|20-30': [
        {
            'id':'435789534954839',
            'value': '@csentence(200,300)',
            'link': 'http://10.23.54.190:8880/link'
        }
    ]
  } 
}