exports.getListOfTasks = function (app, connection, req, res) {
    try {
        var user_id = mysql.escape(app.req.body.user_id);
        var query = queries.gelAllTaskTitleByStudentId(user_id);
        console.log(query);
        connection.query(query, function (err, tasks) {

            if (!err) {
                console.log("got a list of task response");
                console.log(JSON.stringify(tasks));
                if (tasks.length > 0)
                    return res.status(200).json(tasks);
                else
                    return res.status(204).send("Empty list of tasks");
            } else {
                return res.status(400).send("List task had an error - check DB");
            }
        });
    } catch (err) {
        console.log("Error - " + err);
        return res.status(404).send();
    }
};