import sparkMD5 from 'spark-md5'

export function MD5 (file:any, callback:any) {
    var blobSlice = File.prototype.slice,
        file = file,
        chunkSize = 1024 * 1024 * 2,
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new sparkMD5.ArrayBuffer(),
        fileReader = new FileReader()

    fileReader.onload = function (e:any) {
        spark.append(e.target.result)
        currentChunk++
        if (currentChunk < chunks) {
            loadNext()
        } else {
            callback(null, spark.end())
        }
    }

    fileReader.onerror = function () {
        callback('oops, something went wrong.')
    }

    function loadNext() {
        var start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }

    loadNext()
}

