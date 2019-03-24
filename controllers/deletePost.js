const Post = require('../database/models/Post')

module.exports = (req , res ) => {


    Post.findOneAndRemove({_id: req.params.id},
        function(error , User) {

            if(error){
                res.render('not-found')
            }
            else {
                res.redirect('/myblogs')
            }
        }
        )


}