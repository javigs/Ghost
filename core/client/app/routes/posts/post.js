import AuthenticatedRoute from 'ghost/routes/authenticated';
import ShortcutsRoute from 'ghost/mixins/shortcuts-route';
import isNumber from 'ghost/utils/isNumber';
import isFinite from 'ghost/utils/isFinite';

export default AuthenticatedRoute.extend(ShortcutsRoute, {
    model: function (params) {
        var self = this,
            post,
            postId,
            query;

        postId = Number(params.post_id);

        if (!isNumber(postId) || !isFinite(postId) || postId % 1 !== 0 || postId <= 0) {
            return this.transitionTo('error404', params.post_id);
        }

        post = this.store.peekRecord('post', postId);
        if (post) {
            return post;
        }

        query = {
            id: postId,
            status: 'all',
            staticPages: 'all'
        };

        return self.store.queryRecord('post', query).then(function (post) {
            if (post) {
                return post;
            }

            return self.replaceWith('posts.index');
        });
    },

    afterModel: function (post) {
        var self = this;

        return self.get('session.user').then(function (user) {
            if (user.get('isAuthor') && !post.isAuthoredByUser(user)) {
                return self.replaceWith('posts.index');
            }
        });
    },

    setupController: function (controller, model) {
        this._super(controller, model);

        this.controllerFor('posts').set('currentPost', model);
    },

    shortcuts: {
        'enter, o': 'openEditor',
        'command+backspace, ctrl+backspace': 'deletePost'
    },

    actions: {
        openEditor: function (post) {
            post = post || this.get('controller.model');

            if (!post) {
                return;
            }

            this.transitionTo('editor.edit', post.get('id'));
        },

        deletePost: function () {
            this.send('openModal', 'delete-post', this.get('controller.model'));
        }
    }
});
