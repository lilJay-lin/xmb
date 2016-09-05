/**
 * Created by liljay on 2016/9/5.
 */

module.exports =  {
    setResult ({status = 0, res = {}, error = {}, message = ""}) {
        return {status, res, error, message}
    }
}