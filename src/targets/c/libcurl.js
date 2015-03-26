'use strict'

var CodeBuilder = require('../../helpers/code-builder')

module.exports = function (source, options) {
  var code = new CodeBuilder()

  code.push('CURL *hnd = curl_easy_init();')
  code.push('')

  code.push('curl_easy_setopt(hnd, CURLOPT_CUSTOMREQUEST, "%s");', source.method.toUpperCase())
  code.push('curl_easy_setopt(hnd, CURLOPT_URL, "%s");', source.fullUrl)

  // Add headers, including the cookies
  var headers = Object.keys(source.headersObj)

  // construct headers
  if (headers.length) {
    code.push('')
    code.push('struct curl_slist *headers = NULL;')
    headers.map(function (key) {
      code.push('headers = curl_slist_append(headers, "%s: %s");', key, source.headersObj[key])
    })
    code.push('curl_easy_setopt(hnd, CURLOPT_HTTPHEADER, headers);')
  }

  // construct cookies
  if (source.allHeaders.cookie) {
    code.push('')
    code.push('curl_easy_setopt(hnd, CURLOPT_COOKIE, "%s");', source.allHeaders.cookie)
  }

  if (source.postData.text) {
    code.push('')
    code.push('curl_easy_setopt(hnd, CURLOPT_POSTFIELDS, %s);', JSON.stringify(source.postData.text))
  }

  code.push('')
  code.push('CURLcode ret = curl_easy_perform(hnd);')

  return code.join()
}

module.exports.info = {
  key: 'libcurl',
  title: 'Libcurl',
  link: 'http://curl.haxx.se/libcurl/',
  description: 'Simple REST and HTTP API Client for C'
}
