// Module for database CRUD operations

module.exports = function (pool) {

    var module = {}

    const errorHandle = function (err, reject) {
        if (err != null) {

            reject(err)
            return false
        }
        return true
    }

    module.MYSQLERROR = {
        DUPLICATE_PRIMARY_KEY: 1062,
        ROW_REFERENCED: 1451,
        FOREIGN_KEY_CONSTRAINT_FAILED: 1452,
        CANNOT_BE_NULL: 1048
    }

    module.create = function (table, fields, retrieveLastIndex = false) {

        let t_fields = Object.keys(fields)
        let sql = 'INSERT INTO `' + table + '` ('

        let p_fields = '('

        let arr = []
        for (var i = 0; i < t_fields.length; i++) {
            sql += '`' + t_fields[i] + '`'
            p_fields += '?'
            if (i != t_fields.length - 1) {
                sql += ','
                p_fields += ','
            }
            if (fields[t_fields[i]].value == undefined) {
                arr.push(null)
            } else {
                arr.push(fields[t_fields[i]].value)
            }
        }

        p_fields += ');'
        sql += ') VALUES ' + p_fields
        
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, conn) {
                if (errorHandle(err, reject)) {
                    conn.execute(sql, arr, function (error, result, fields) {                        
                        if (error) {
                            conn.query('ROLLBACK;', function (error, results, fields) {
                                if (error) console.log(error)
                                pool.releaseConnection(conn)
                            })
                            reject(error)
                        } else {
                            if (!retrieveLastIndex) {
                                resolve(true)
                            } else {
                                resolve(result.insertId)
                            }
                            conn.query('COMMIT;', function (error, results, fields) {
                                if (error) console.log(error)
                                pool.releaseConnection(conn)
                            })
                        }
                    })
                }
            })
        })
    }

    module.read = function (table, fields, condition = false, order = false, limit = false) {

        let sql = 'SELECT '

        let arr = []

        let p_fields = ' FROM `' + table + '`'

        if (fields.length > 0) {
            for (var i = 0; i < fields.length; i++) {
                sql += fields[i]
                if (i != fields.length - 1) {
                    sql += ','
                }
            }
        } else {
            sql += '*'
        }

        if (condition != false) {

            let c_fields = Object.keys(condition)

            p_fields += ' WHERE '

            for (var i = 0; i < c_fields.length; i++) {

                if (condition[c_fields[i]].alternate == null) {
                    p_fields += '`' + c_fields[i] + '` = ? '
                } else {
                    p_fields += '(`' + c_fields[i] + '` = ? '
                }

                if (condition[c_fields[i]].next != null) {
                    p_fields += condition[c_fields[i]].next + ' '
                }

                arr.push(condition[c_fields[i]].value)

                if (condition[c_fields[i]].alternate != null) {
                    if (condition[c_fields[i]].alternate.length > 0) {
                        for (var j = 0; j < condition[c_fields[i]].alternate.length; j++) {
                            p_fields += ' OR `' + c_fields[i] + '` = ? '
                            arr.push(condition[c_fields[i]].alternate[j])
                            if (j == condition[c_fields[i]].alternate.length - 1) {
                                p_fields += ') '
                            }
                        }
                    } else {
                        p_fields += ' ) '
                    }
                }
            }
        }

        sql += p_fields

        if (order != false) {

            sql += " ORDER BY `"

            let o_fields = Object.keys(order)

            for (var i = 0; i < o_fields.length; i++) {

                let type = order[o_fields[i]].descending ? "DESC" : "ASC"

                sql += o_fields[i] + "` " + type

                if (i != o_fields.length - 1) {
                    sql += ","
                }
            }
        }

        if (limit != false) {
            if (typeof limit === 'string') {
                sql += " LIMIT " + limit + ";"
            } else {
                sql += ' LIMIT ' + limit.limit + ' OFFSET ' + limit.offset + ';'
            }
        }
        
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, conn) {
                if (errorHandle(err, reject)) {
                    conn.execute(sql, arr, function (error, results, fields) {
                        if (error) {
                            conn.query('ROLLBACK;', function (error, results, fields) {
                                if (error) console.log(error)
                                pool.releaseConnection(conn)
                            })
                            reject(error)
                        } else {
                            resolve(results)
                            conn.query('COMMIT;', function (error, results, fields) {
                                if (error) console.log(error)
                                pool.releaseConnection(conn)
                            })
                        }
                    })
                }
            })
        })
    }

    module.read_join = function (table, fields, condition = false, join, where_no = 0, order = false, limit = false) {
        let sql = 'SELECT '

        let arr = []
        p_fields = ' FROM `' + table[0] + '`'

        if (fields.length > 0) {
            for (var i = 0; i < fields.length; i++) {
                if (typeof fields[i] === 'string') {
                    sql += fields[i]
                    if (i != fields.length - 1) {
                        sql += ','
                    }
                } else {
                    sql += fields[i].original + ' AS ' + fields[i].alias
                    if (i != fields.length - 1) {
                        sql += ','
                    }
                }
            }
        } else {
            sql += '*'
        }

        if (table.length > 1) {
            var i = 0
            while (i < table.length - 1) {
                p_fields += " JOIN `" + table[i + 1] + "` ON `" + table[i + 1] + "`.`" + join[i][1] + "`=`" + table[0] + "`.`" + join[i][0] + "`"
                i++
            }
        }

        if (condition != false) {
            let c_fields = Object.keys(condition)

            p_fields += ' WHERE '

            for (var i = 0; i < c_fields.length; i++) {
                if (condition[c_fields[i]].between == true) {
                    p_fields += '`' + table[where_no] + '`.`' + c_fields[i] + '` BETWEEN ? AND ? '
                } else if (condition[c_fields[i]].in == true) {
                    p_fields += '`' + table[where_no] + '`.`' + c_fields[i] + '` IN ' + condition[c_fields[i]].value + ' '
                } else {
                    if (!condition[c_fields[i]].operator) {
                        p_fields += '`' + table[where_no] + '`.`' + c_fields[i] + '` = ? '
                    } else {
                        p_fields += '`' + table[where_no] + '`.`' + c_fields[i] + '` ' + condition[c_fields[i]].operator + ' ? '
                    }
                }

                if (condition[c_fields[i]].next != null && i !== c_fields.length - 1) {
                    p_fields += condition[c_fields[i]].next + ' '
                }

                if (condition[c_fields[i]].between == true) {
                    arr.push(condition[c_fields[i]].low_value)
                    arr.push(condition[c_fields[i]].high_value)
                } else if (condition[c_fields[i]].in == true) {
                    condition[c_fields[i]].value_list.forEach(value => {
                        arr.push(value)
                    })
                } else {
                    arr.push(condition[c_fields[i]].value)
                }

                if (condition[c_fields[i]].alternate != null) {
                    if (condition[c_fields[i]].alternate.length > 0) {
                        for (var j = 0; j < condition[c_fields[i]].alternate.length; j++) {
                            p_fields += ' OR `' + c_fields[i] + '` = ? '
                            arr.push(condition[c_fields[i]].alternate[j])
                            if (j == condition[c_fields[i]].alternate.length - 1) {
                                p_fields += ') '
                            }
                        }
                    } else {
                        p_fields += ' ) '
                    }
                }
            }
        }
        sql += p_fields

        if (order != false) {

            sql += " ORDER BY "

            let o_fields = Object.keys(order)

            for (var i = 0; i < o_fields.length; i++) {

                let type = order[o_fields[i]].descending ? "DESC" : "ASC"

                sql += o_fields[i] + " " + type

                if (i != o_fields.length - 1) {
                    sql += ","
                }
            }
        }

        if (limit != false) {
            sql += " LIMIT " + limit + ";"
        }

        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, conn) {
                if (errorHandle(err, reject)) {
                    conn.execute(sql, arr, function (error, results, fields) {
                        if (error) {
                            conn.query('ROLLBACK;', function (error, results, fields) {
                                if (error) console.log(error)
                                pool.releaseConnection(conn)
                            })
                            reject(error)
                        } else {
                            resolve(results)
                            conn.query('COMMIT;', function (error, results, fields) {
                                if (error) console.log(error)
                                pool.releaseConnection(conn)
                            })
                        }
                    })
                }
            })
        })
    }

    module.update = function (table, fields) {

        let f_fields = Object.keys(fields)
        let sql = 'UPDATE `' + table + '` SET '

        let u_fields = '',
            arr = []

        for (var i = 0; i < f_fields.length; i++) {
            if (f_fields[i] === 'where') continue
            if (i === f_fields.length - 1) {
                u_fields += '`' + f_fields[i] + '` = ? '
            } else {
                u_fields += '`' + f_fields[i] + '` = ?, '
            }

            arr.push(fields[f_fields[i]].value)
        }

        u_fields = u_fields.substring(0, u_fields.length - 1)

        sql += u_fields

        let where = ''
        let w_fields = Object.keys(fields.where)
        for (var i = 0; i < w_fields.length; i++) {

            if (fields.where[w_fields[i]].value === null) {
                where += '`' + w_fields[i] + '` IS NULL '
            } else {
                where += '`' + w_fields[i] + '` = ? '
                arr.push(fields.where[w_fields[i]].value)
            }

            if (fields.where[w_fields[i]].next != null) {
                where += fields.where[w_fields[i]].next + ' '
            }
        }

        sql += " WHERE " + where
        
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, conn) {
                conn.execute(sql, arr, function (error, results, fields) {
                    if (error) {
                        conn.query('ROLLBACK;', function (error, results, fields) {
                            if (error) console.log(error)
                            pool.releaseConnection(conn)
                        })
                        reject(error)
                    } else {
                        resolve(true)
                        conn.query('COMMIT;', function (error, results, fields) {
                            if (error) console.log(error)
                            pool.releaseConnection(conn)
                        })
                    }
                })
            })
        })
    }

    module.delete = function (table, condition) {

        let c_fields = Object.keys(condition)
        let sql = 'DELETE FROM `' + table + '` WHERE '
        if (!c_fields) {
            return ('Conditions must be added')
        }

        let arr = []
        for (var i = 0; i < c_fields.length; i++) {

            sql += '`' + c_fields[i] + '` = ? '

            if (condition[c_fields[i]].next != null) {
                sql += condition[c_fields[i]].next + ' '
            }

            arr.push(condition[c_fields[i]].value)
        }

        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, conn) {
                conn.execute(sql, arr, function (error, results, fields) {
                    if (error) {
                        conn.query('ROLLBACK;', function (error, results, fields) {
                            if (error) console.log(error)
                            pool.releaseConnection(conn)
                        })
                        reject(error)
                    } else {
                        resolve(true)
                        conn.query('COMMIT;', function (error, results, fields) {
                            if (error) console.log(error)
                            pool.releaseConnection(conn)
                        })
                    }
                })
            })
        })
    }

    module.count = function (table, fields, condition = false) {

        let sql = 'SELECT COUNT'

        let arr = []

        let p_fields = ' FROM `' + table + '`'

        if (fields.length > 0) {
            for (var i = 0; i < fields.length; i++) {
                sql += `(${fields[i]})`
                if (i != fields.length - 1) {
                    sql += ','
                }
            }
        } else {
            throw new Error('Specify Column')
        }

        if (condition != false) {

            let c_fields = Object.keys(condition)

            p_fields += ' WHERE '

            for (var i = 0; i < c_fields.length; i++) {

                if (condition[c_fields[i]].alternate == null) {
                    p_fields += '`' + c_fields[i] + '` = ? '
                } else {
                    p_fields += '(`' + c_fields[i] + '` = ? '
                }

                if (condition[c_fields[i]].next != null) {
                    p_fields += condition[c_fields[i]].next + ' '
                }

                arr.push(condition[c_fields[i]].value)
            }
        }

        sql += p_fields
        
        return new Promise(function (resolve, reject) {
            pool.getConnection(function (err, conn) {
                if (errorHandle(err, reject)) {
                    conn.execute(sql, arr, function (error, results, fields) {
                        if (error) {
                            conn.query('ROLLBACK;', function (error, results, fields) {
                                if (error) console.log(error)
                                pool.releaseConnection(conn)
                            })
                            reject(error)
                        } else {
                            resolve(results)
                            conn.query('COMMIT;', function (error, results, fields) {
                                if (error) console.log(error)
                                pool.releaseConnection(conn)
                            })
                        }
                    })
                }
            })

        })
    }

    return module
}