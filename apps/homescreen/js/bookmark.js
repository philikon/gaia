
'use strict';

var Bookmark = function Bookmark(params) {
  this.removable = true;

  this.isBookmark = true;
  this.url = params.bookmarkURL;

  this.manifest = {
    name: params.name,
    icons: {
      60: params.icon
    },
    default_locale: 'en-US'
  };
};

Bookmark.prototype = {
  launch: function bookmark_launch(url, name) {
    var features = {
      name: this.manifest.name.replace(/\s/g, '&nbsp;'),
      icon: this.manifest.icons['60']
    };

    if (!Applications.isInstalled(this.origin)) {
      features.origin = {
        name: features.name,
        url: encodeURIComponent(this.origin)
      };
    }

    if (url && url !== this.origin && !Applications.isInstalled(url)) {
      var searchName = navigator.mozL10n.get('wrapper-search-name', {
        topic: name,
        name: this.manifest.name
      }).replace(/\s/g, '&nbsp;');

      features.name = searchName;
      features.search = {
        name: searchName,
        url: encodeURIComponent(url)
      };
    }

    // The third parameter is received in window_manager without whitespaces
    // so we decice replace them for &nbsp;
    return window.open(url || this.origin, '_blank', JSON.stringify(features));
  },

  uninstall: function bookmark_uninstall() {
    GridManager.uninstall(this);
  }
};

var BookmarkEditor = {
  init: function bookmarkEditor_show(data) {
    this.data = data;
    this.bookmarkEntrySheet = document.getElementById('bookmark-entry-sheet');
    this.bookmarkTitle = document.getElementById('bookmark-title');
    this.bookmarkUrl = document.getElementById('bookmark-url');
    this.cancelButton = document.getElementById('button-bookmark-cancel');
    this.addButton = document.getElementById('button-bookmark-add');

    this.bookmarkEntrySheet.classList.add('active');

    this.cancelButton.addEventListener('click', this.close.bind(this));
    this.addButton.addEventListener('click', this.save.bind(this));

    this.bookmarkTitle.value = data.name || '';
    this.bookmarkUrl.value = data.url || '';
  },

  close: function bookmarkEditor_close() {
    this.bookmarkEntrySheet.classList.remove('active');
  },

  save: function bookmarkEditor_save() {
    this.data.name = this.bookmarkTitle.value;
    this.data.bookmarkURL = this.bookmarkUrl.value;
    var app = new Bookmark(this.data);
    GridManager.install(app);
    this.close();
  }
};
