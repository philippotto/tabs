import React from 'react';
import type { ReactWrapper } from 'enzyme';
import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import Tabs from '../src';
import type { TabsProps } from '../src/Tabs';

describe('Tabs.Basic', () => {
  function getTabs(props: TabsProps = null) {
    const mergedProps = {
      items: [
        {
          label: 'light',
          key: 'light',
          children: 'Light',
        },
        {
          label: 'bamboo',
          key: 'bamboo',
          children: 'Bamboo',
        },
        {
          label: 'cute',
          key: 'cute',
          children: 'Cute',
        },
      ],
      ...props,
    };

    return <Tabs {...mergedProps} />;
  }

  it('Normal', () => {
    const wrapper = mount(getTabs({ defaultActiveKey: 'bamboo' }));

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('disabled not change', () => {
    const onChange = jest.fn();

    const wrapper = mount(
      getTabs({
        defaultActiveKey: 'light',
        items: [
          {
            label: 'light',
            key: 'light',
            children: 'Light',
          },
          {
            label: 'disabled',
            key: 'disabled',
            children: 'Disabled',
            disabled: true,
          },
        ],
      }),
    );

    wrapper.find('.rc-tabs-tab-disabled').simulate('click');
    expect(onChange).not.toHaveBeenCalled();
  });

  it('Skip invalidate children', () => {
    const wrapper = mount(
      getTabs({
        items: [
          {
            label: 'light',
            key: 'light',
            children: 'Light',
          },
          'not me' as any,
        ],
      }),
    );
    wrapper.update();

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('nothing for empty tabs', () => {
    mount(getTabs({ items: null }));
  });

  describe('onChange and onTabClick should work', () => {
    const list: { name: string; trigger: (wrapper: ReactWrapper) => void }[] = [
      {
        name: 'outer div',
        trigger: wrapper => wrapper.find('.rc-tabs-tab').at(2).simulate('click'),
      },
      {
        name: 'inner button',
        trigger: wrapper => wrapper.find('.rc-tabs-tab .rc-tabs-tab-btn').at(2).simulate('click'),
      },
      {
        name: 'inner button key down',
        trigger: wrapper =>
          wrapper.find('.rc-tabs-tab .rc-tabs-tab-btn').at(2).simulate('keydown', {
            which: KeyCode.SPACE,
          }),
      },
    ];

    list.forEach(({ name, trigger }) => {
      it(name, () => {
        const onChange = jest.fn();
        const onTabClick = jest.fn();
        const wrapper = mount(getTabs({ onChange, onTabClick }));

        trigger(wrapper);
        expect(onTabClick).toHaveBeenCalledWith('cute', expect.anything());
        expect(onChange).toHaveBeenCalledWith('cute');
      });
    });

    // https://github.com/ant-design/ant-design/issues/33032
    it('should not trigger onChange when click current tab', () => {
      const onChange = jest.fn();
      const onTabClick = jest.fn();
      const wrapper = mount(getTabs({ onChange, onTabClick }));

      wrapper.find('.rc-tabs-tab').at(0).simulate('click');
      expect(onTabClick).toHaveBeenCalledWith('light', expect.anything());
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('active first tab when children is changed', () => {
    const wrapper = mount(getTabs());
    wrapper.setProps({
      items: [
        {
          label: 'Yo',
          key: '2333',
          children: 'New',
        },
      ],
    });
    wrapper.update();
    expect(wrapper.find('.rc-tabs-tab-active').text()).toEqual('Yo');
  });

  it('active first tab when children is not changed at controlled mode', () => {
    const wrapper = mount(getTabs({ activeKey: 'light' }));
    expect(wrapper.find('.rc-tabs-tab-active').text()).toEqual('light');

    wrapper.setProps({
      items: [
        {
          label: 'Yo',
          key: '2333',
          children: 'New',
        },
      ],
    });
    expect(wrapper.find('.rc-tabs-tab-active')).toHaveLength(0);
  });

  it('tabBarGutter should work', () => {
    const topTabs = mount(getTabs({ tabBarGutter: 23 }));
    expect(topTabs.find('.rc-tabs-tab').at(0).props().style?.marginLeft).toBe(undefined);
    expect(topTabs.find('.rc-tabs-tab').at(1).props().style?.marginLeft).toBe(23);

    const rightTabs = mount(getTabs({ tabBarGutter: 33, tabPosition: 'right' }));
    expect(rightTabs.find('.rc-tabs-tab').at(0).props().style?.marginTop).toEqual(undefined);
    expect(rightTabs.find('.rc-tabs-tab').at(1).props().style?.marginTop).toEqual(33);
  });

  describe('renderTabBar', () => {
    it('works', () => {
      const renderTabBar = jest.fn((props, Component) => {
        return (
          <div className="my-wrapper">
            <Component {...props}>{node => <span className="my-node">{node}</span>}</Component>
          </div>
        );
      });
      const wrapper = mount(getTabs({ renderTabBar }));
      expect(wrapper.find('.my-wrapper').length).toBeTruthy();
      expect(wrapper.find('.my-node').length).toBeTruthy();
      expect(renderTabBar).toHaveBeenCalled();
    });
    it('has panes property in props', () => {
      const renderTabBar = props => {
        return (
          <div>
            {props.panes.map(pane => (
              <span key={pane.key} data-key={pane.key}>
                tab
              </span>
            ))}
          </div>
        );
      };
      const wrapper = mount(getTabs({ renderTabBar }));
      expect(wrapper.find('[data-key="light"]').length).toBeTruthy();
      expect(wrapper.find('[data-key="bamboo"]').length).toBeTruthy();
      expect(wrapper.find('[data-key="cute"]').length).toBeTruthy();
    });
  });

  it('destroyInactiveTabPane', () => {
    const props = {
      activeKey: 'light',
      destroyInactiveTabPane: true,
      items: [
        {
          key: 'light',
          children: 'Light',
        },
        {
          key: 'bamboo',
          children: 'Bamboo',
        },
      ] as any,
    };

    const { container, rerender } = render(getTabs(props));

    function matchText(text: string) {
      expect(container.querySelectorAll('.rc-tabs-tabpane')).toHaveLength(1);
      expect(container.querySelector('.rc-tabs-tabpane-active').textContent).toEqual(text);
    }

    matchText('Light');

    rerender(
      getTabs({
        ...props,
        activeKey: 'bamboo',
      }),
    );
    matchText('Bamboo');
  });

  describe('editable', () => {
    it('no and', () => {
      const onEdit = jest.fn();
      const wrapper = mount(getTabs({ editable: { onEdit, showAdd: false } }));
      expect(wrapper.find('.rc-tabs-nav-add')).toHaveLength(0);
    });

    it('add', () => {
      const onEdit = jest.fn();
      const wrapper = mount(getTabs({ editable: { onEdit } }));
      wrapper.find('.rc-tabs-nav-add').first().simulate('click');
      expect(onEdit).toHaveBeenCalledWith('add', {
        key: undefined,
        event: expect.anything(),
      });
    });

    const list: { name: string; trigger: (node: ReactWrapper) => void }[] = [
      {
        name: 'click',
        trigger: node => {
          node.simulate('click');
        },
      },
    ];

    list.forEach(({ name, trigger }) => {
      it(`remove by ${name}`, () => {
        const onEdit = jest.fn();
        const wrapper = mount(getTabs({ editable: { onEdit } }));

        const first = wrapper.find('.rc-tabs-tab-remove').first();
        trigger(first);

        // Should be button to enable press SPACE key to trigger
        expect(first.instance() instanceof HTMLButtonElement).toBeTruthy();

        expect(onEdit).toHaveBeenCalledWith('remove', {
          key: 'light',
          event: expect.anything(),
        });
      });
    });

    it('customize closeIcon', () => {
      const onEdit = jest.fn();
      const wrapper = mount(
        getTabs({
          editable: { onEdit },
          items: [
            {
              key: 'light',
              closeIcon: <span className="close-light" />,
              children: 'Light',
            },
          ] as any,
        }),
      );

      expect(wrapper.find('.rc-tabs-tab-remove').find('.close-light').length).toBeTruthy();
    });
  });

  it('extra', () => {
    const wrapper = mount(getTabs({ tabBarExtraContent: 'Bamboo' }));
    expect(wrapper.find('.rc-tabs-extra-content').text()).toEqual('Bamboo');
  });

  it('extra position', () => {
    const wrapper = mount(
      getTabs({ tabBarExtraContent: { left: 'Left Bamboo', right: 'Right Bamboo' } }),
    );
    expect(wrapper.find('.rc-tabs-extra-content').first().text()).toEqual('Left Bamboo');

    expect(wrapper.find('.rc-tabs-extra-content').at(1).text()).toEqual('Right Bamboo');
  });

  it('no break of empty object', () => {
    mount(getTabs({ tabBarExtraContent: {} }));
  });

  describe('animated', () => {
    it('false', () => {
      const wrapper = mount(getTabs({ animated: false }));
      expect(wrapper.find('TabPanelList').prop('animated')).toEqual({
        inkBar: false,
        tabPane: false,
      });
    });

    it('true', () => {
      const wrapper = mount(getTabs({ animated: true }));
      expect(wrapper.find('TabPanelList').prop('animated')).toEqual({
        inkBar: true,
        tabPane: false,
      });
    });

    it('customize but !tabPaneMotion', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const wrapper = mount(getTabs({ animated: { inkBar: false, tabPane: true } }));
      expect(wrapper.find('TabPanelList').prop('animated')).toEqual({
        inkBar: false,
        tabPane: false,
      });

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: `animated.tabPane` is true but `animated.tabPaneMotion` is not provided. Motion will not work.',
      );
      errorSpy.mockRestore();
    });

    it('customize', () => {
      const wrapper = mount(
        getTabs({ animated: { inkBar: true, tabPane: true, tabPaneMotion: {} } }),
      );
      expect(wrapper.find('TabPanelList').prop('animated')).toEqual(
        expect.objectContaining({
          inkBar: true,
          tabPane: true,
        }),
      );
    });
  });

  it('focus to scroll', () => {
    const wrapper = mount(getTabs());
    wrapper.find('.rc-tabs-tab-btn').first().simulate('focus');
    wrapper.unmount();
  });

  it('tabBarStyle', () => {
    const wrapper = mount(getTabs({ tabBarStyle: { background: 'red' } }));
    expect(wrapper.find('.rc-tabs-nav').prop('style').background).toEqual('red');
  });
});
