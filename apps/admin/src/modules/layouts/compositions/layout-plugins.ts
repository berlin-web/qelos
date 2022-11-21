import {computed, ref, toRef} from 'vue';
import {ILayoutContent, IPlugin} from '@qelos/view-builder/src';
import {LayoutConnectedDataKind} from '@qelos/sdk/dist/administrator/layouts';
import {useBlocksList} from '@/modules/blocks/store/blocks-list';
import useMenusList from '@/modules/menus/store/menus-list';

export function getStylesheetContent(href = ''): ILayoutContent {
  return {
    component: 'link',
    predefined: false,
    classes: '',
    props: {
      rel: 'stylesheet',
      href,
    },
  }
}

function getStylesheetPlugin(href = ''): IPlugin {
  return {
    match: 'link[rel=stylesheet]',
    component: 'link',
    title: 'Resource Link to CSS',
    description: 'Load CSS file in page',
    supportChildren: false,
    props: {
      rel: 'stylesheet',
      href,
    },
  };
}

const customPlugins: Record<string, IPlugin[]> = {
  category: [
    {
      match: 'CategoryTitle',
      component: 'CategoryTitle',
      title: 'Category Title',
      description: 'using H1',
      supportChildren: false,
      predefined: true,
      props: {
        category: '$category'
      },
      connectedData: {
        kind: LayoutConnectedDataKind.CATEGORY,
        reference: '$category',
      }
    },
    {
      match: 'CategoryContent',
      component: 'CategoryContent',
      title: 'Category Content',
      description: 'Show the content of the category',
      supportChildren: false,
      predefined: true,
      props: {
        category: '$category'
      },
      connectedData: {
        kind: LayoutConnectedDataKind.CATEGORY,
        reference: '$category',
      }
    },
    {
      match: 'PostsList',
      component: 'PostsList',
      title: 'Category Posts',
      description: 'Posts list of existing category',
      supportChildren: false,
      predefined: true,
      props: {
        posts: '$categoryPosts'
      },
      connectedData: {
        kind: LayoutConnectedDataKind.CATEGORY_POSTS,
        reference: '$categoryPosts',
      }
    },
  ],
  post: [
    {
      match: 'PostTitle',
      component: 'PostTitle',
      title: 'Post Title',
      description: 'using H1',
      supportChildren: false,
      predefined: true,
      props: {
        post: '$post'
      },
      connectedData: {
        kind: LayoutConnectedDataKind.POST,
        reference: '$post',
      }
    },
    {
      match: 'PostShort',
      component: 'PostShort',
      title: 'Post Short',
      description: 'Show the short of the post',
      supportChildren: false,
      predefined: true,
      props: {
        post: '$post'
      },
      connectedData: {
        kind: LayoutConnectedDataKind.POST,
        reference: '$post',
      }
    },
    {
      match: 'PostContent',
      component: 'PostContent',
      title: 'Post Content',
      description: 'Show the content of the post',
      supportChildren: false,
      predefined: true,
      props: {
        post: '$post'
      },
      connectedData: {
        kind: LayoutConnectedDataKind.POST,
        reference: '$post',
      }
    },
  ],
  index: [
    {
      match: 'CategoryContent',
      component: 'CategoryContent',
      title: 'Home Page Content',
      description: 'Show the content of the home page',
      supportChildren: false,
      predefined: true,
      props: {
        category: '$homePage'
      },
      connectedData: {
        kind: LayoutConnectedDataKind.CATEGORY,
        context: {path: '-'},
        reference: '$homePage',
      }
    },
    {
      match: 'PostsList',
      component: 'PostsList',
      title: 'Posts List',
      description: '',
      supportChildren: false,
      predefined: true,
      props: {
        posts: '$posts'
      },
      connectedData: {
        kind: LayoutConnectedDataKind.POSTS,
        reference: '$posts',
      }
    },
  ],
  signin: [
    {
      match: 'SignInForm',
      component: 'SignInForm',
      title: 'Sign In Form',
      description: 'Email & Password form',
      supportChildren: false,
      predefined: true,
      props: {
        emailLabel: 'Email',
        passwordLabel: 'Password',
        submitLabel: 'Sign In'
      },
    },
  ],
}

const basicPlugins: IPlugin[] = [
  {
    match: 'div.flex-row',
    component: 'div',
    title: 'Row',
    description: 'Flex Row Div',
    classes: 'flex-row',
  },
  getStylesheetPlugin(),
  ...['div', 'header', 'footer', 'main', 'aside', 'section'].map(tag => {
    return {
      match: tag,
      component: tag,
      title: tag,
      description: tag,
      supportChildren: true,
      showChildren: true,
    }
  }),
];

function getBlockPlugin({_id, name}) {
  const reference = 'block_' + _id;
  return {
    match: `BlockBox[block=${reference}]`,
    component: 'BlockBox',
    title: 'Block: ' + name,
    description: 'Managed Content from Blocks',
    supportChildren: false,
    predefined: true,
    props: {
      block: reference
    },
    connectedData: {
      kind: LayoutConnectedDataKind.BLOCK,
      reference,
      identifier: _id,
    }
  };
}

function getMenuPlugin(menuName: string) {
  const reference = 'menu_' + menuName;
  return {
    match: `Menu[menu=${reference}]`,
    component: 'Menu',
    title: 'Menu: ' + menuName,
    description: 'Links menu',
    supportChildren: false,
    predefined: true,
    props: {
      menu: reference
    },
    connectedData: {
      kind: LayoutConnectedDataKind.MENU,
      reference,
      identifier: menuName
    }
  };
}

export function usePlugins(kind: string) {
  const blocks = toRef(useBlocksList(), 'blocks');
  const menus = toRef(useMenusList(), 'menus');

  const plugins = ref([
    ...(customPlugins[kind] || []),
    ...basicPlugins,
  ]);

  return computed(() => [
    ...plugins.value,
    ...(blocks.value || []).map(getBlockPlugin),
    ...(menus.value || []).map(getMenuPlugin),
  ]);
}
