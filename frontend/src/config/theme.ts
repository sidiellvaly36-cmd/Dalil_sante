import type { ThemeConfig } from 'antd'

/**
 * إعدادات ثيم Ant Design
 * -----------------------
 * تخصيص شامل لألوان وأشكال مكونات Ant Design بحيث تعطي مظهر
 * لوحات تحكم احترافية (على غرار Ant Design Pro).
 * أي تخصيص لوني إضافي يجب أن يمر من هنا فقط، وليس عبر CSS مباشر،
 * حتى تبقى المكونات (Button, Table, Modal ...) متجانسة تلقائيًا.
 */
export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#1677ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1677ff',
    colorLink: '#1677ff',

    borderRadius: 8,

    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,

    colorBgLayout: '#f5f7fa',
    colorBgContainer: '#ffffff',

    controlHeight: 38,
    wireframe: false,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerHeight: 64,
      headerPadding: '0 24px',
      siderBg: '#001529',
      bodyBg: '#f5f7fa',
    },
    Menu: {
      darkItemBg: '#001529',
      darkSubMenuItemBg: '#000c17',
      darkItemSelectedBg: '#1677ff',
      itemBorderRadius: 8,
      itemMarginInline: 8,
    },
    Card: {
      borderRadiusLG: 12,
      boxShadowTertiary:
        '0 1px 2px -2px rgba(0, 0, 0, 0.08), 0 3px 6px 0 rgba(0, 0, 0, 0.05), 0 5px 12px 4px rgba(0, 0, 0, 0.03)',
    },
    Table: {
      headerBg: '#fafafa',
      borderRadius: 8,
      cellPaddingBlock: 12,
    },
    Button: {
      borderRadius: 8,
      controlHeight: 38,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 38,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 38,
    },
  },
}
