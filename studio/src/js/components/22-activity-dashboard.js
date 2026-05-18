// ── Activity Dashboard — plain-English view for non-technical users ────────────
// Shows: what's been protected, what was blocked, which agents are active,
// recent activity feed. No jargon. No raw JSON. Just what happened.

const CAPABILITY_LABELS = {
  'files.read':         'Read files',
  'files.write':        'Write files',
  'web.search':         'Search the web',
  'web.fetch':          'Browse websites',
  'shell.run':          'Run terminal commands',
  'shell.exec_privileged': 'Run admin commands',
  'network.raw_socket': 'Open raw network connections',
  'process.kill_system':'Kill system processes',
  'trade.equity':       'Execute trades',
  'portfolio.read':     'Read portfolio',
  'email.send':         'Send emails',
  'calendar.write':     'Edit calendar',
  'governance.vote':    'Vote on proposals',
};

function capLabel(cap) {
  return CAPABILITY_LABELS[cap] || cap;
}

function timeAgo(isoStr) {
  if (!isoStr) return '';
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return mins + 'm ago';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h ago';
  return Math.floor(hrs / 24) + 'd ago';
}

function ActivityDashboard() {
  const { api, settings } = useContext(Ctx);
  const gwUrl = settings.gwUrl || 'http://localhost:8080';

  const [passports,  setPassports]  = useState([]);
  const [events,     setEvents]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [health,     setHealth]     = useState(null);

  async function load() {
    setLoading(true);
    const [ppR, healthR] = await Promise.all([
      api('GET', '/v1/passports/list'),
      fetch(gwUrl + '/healthz').then(r => r.json()).catch(() => null),
    ]);
    if (ppR.ok) setPassports(ppR.data.passports || []);
    setHealth(healthR);
    // Events would come from audit log — show mock summary for now based on passport data
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const total    = passports.length;
  const active   = passports.filter(p => p.days_remaining > 0).length;
  const expiring = passports.filter(p => p.days_remaining !== null && p.days_remaining >= 0 && p.days_remaining < 7).length;
  const expired  = passports.filter(p => p.days_remaining < 0).length;
  const running  = health?.status === 'ok';

  return h('div', { style: { paddingBottom: 40 } },

    h('div', { style: { marginBottom: 20 } },
      h('h2', { style: { fontSize: 18, fontWeight: 700, marginBottom: 4 } }, '📊 Activity Dashboard'),
      h('p', { style: { color: 'var(--t2)', fontSize: 'var(--fsm)', lineHeight: 1.6 } },
        'A plain-English view of what A1 is protecting and what\'s been happening.')),

    // ── Status bar ────────────────────────────────────────────────────────────
    h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 } },
      ...[
        { label: 'A1 Status',         value: running ? '🟢 Running' : '🔴 Stopped', color: running ? 'var(--green)' : '#ef4444' },
        { label: 'Protected agents',  value: active,   color: 'var(--green)' },
        { label: 'Expiring soon',     value: expiring, color: expiring > 0 ? '#ca8a04' : 'var(--t2)' },
        { label: 'Expired',           value: expired,  color: expired > 0 ? '#ef4444' : 'var(--t2)' },
      ].map(s => h('div', { key: s.label, style: { background: 'var(--b2)', border: '1px solid var(--b3)', borderRadius: 'var(--r)', padding: '14px 16px' } },
        h('div', { style: { fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4 } }, s.value),
        h('div', { style: { fontSize: 'var(--fxs)', color: 'var(--t2)' } }, s.label)
      ))
    ),

    loading && h('div', { className: 'empty' }, 'Loading…'),

    // ── Protected agents list ─────────────────────────────────────────────────
    !loading && passports.length > 0 && h('div', { className: 'sg', style: { marginBottom: 16 } },
      h('div', { className: 'sg-head' }, '🛡 Protected agents (' + total + ')'),
      h('div', { className: 'sg-body' },
        passports.map(pp => {
          const days = pp.days_remaining;
          const ok   = days > 0;
          const warn = ok && days < 7;
          const color = days < 0 ? '#ef4444' : warn ? '#ca8a04' : 'var(--green)';
          const status = days < 0 ? 'Expired' : warn ? days + ' days left' : 'Active';

          return h('div', { key: pp.namespace, style: { padding: '12px 14px', borderBottom: '1px solid var(--b3)', display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' } },
            h('div', { style: { width: 8, height: 8, borderRadius: '50%', background: color, marginTop: 6, flexShrink: 0 } }),
            h('div', { style: { flex: 1, minWidth: 0 } },
              h('div', { style: { fontWeight: 600, fontSize: 'var(--fsm)', marginBottom: 4 } }, pp.namespace),
              h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 4 } },
                (pp.capabilities || []).map(cap =>
                  h('span', { key: cap, style: { fontSize: 10, background: 'rgba(99,102,241,.1)', color: 'var(--accent)', padding: '2px 7px', borderRadius: 10, border: '1px solid rgba(99,102,241,.2)' } },
                    capLabel(cap)
                  )
                )
              )
            ),
            h('div', { style: { textAlign: 'right', flexShrink: 0 } },
              h('div', { style: { fontSize: 'var(--fxs)', fontWeight: 600, color } }, status),
              h('button', {
                className: 'btn btn-s btn-sm',
                style: { fontSize: 'var(--fxs)', marginTop: 4 },
                onClick: () => window.dispatchEvent(new CustomEvent('a1-navigate', { detail: 'passports' })),
              }, 'Manage →')
            )
          );
        })
      )
    ),

    !loading && passports.length === 0 && h('div', { className: 'sg', style: { marginBottom: 16 } },
      h('div', { className: 'sg-head' }, '🛡 Protected agents'),
      h('div', { className: 'sg-body' },
        h('div', { style: { padding: '20px 14px', textAlign: 'center', color: 'var(--t2)' } },
          h('div', { style: { fontSize: 32, marginBottom: 8 } }, '🔓'),
          h('div', { style: { fontWeight: 600, marginBottom: 6 } }, 'No agents protected yet'),
          h('div', { style: { fontSize: 'var(--fxs)', marginBottom: 14 } }, 'Create a passport to start protecting your AI agents.'),
          h('button', {
            className: 'btn btn-p',
            onClick: () => window.dispatchEvent(new CustomEvent('a1-navigate', { detail: 'wizard' })),
          }, '🛡 Protect my first agent')
        )
      )
    ),

    // ── What A1 does ──────────────────────────────────────────────────────────
    h('div', { className: 'sg' },
      h('div', { className: 'sg-head' }, '🔍 How A1 protects your agents'),
      h('div', { className: 'sg-body' },
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 0' } },
          ...[
            { icon: '✅', title: 'Allowed actions go through',     body: 'When your agent does something it\'s authorized for (like searching the web), A1 approves it instantly and keeps a receipt.' },
            { icon: '🚫', title: 'Blocked actions are stopped',    body: 'If your agent tries to do something outside its passport — like opening raw network connections — A1 blocks it before it happens.' },
            { icon: '📋', title: 'Every action gets a receipt',    body: 'A tamper-proof record is created for every action. You can see what happened, when, and which agent did it.' },
            { icon: '⏰', title: 'Access expires automatically',   body: 'Passports have a time limit. When they expire, the agent can\'t act until you renew. No forgotten access.' },
            { icon: '🔑', title: 'You can revoke at any time',    body: 'Click Revoke in the Passports tab and the agent immediately loses all authorization. No waiting, no exceptions.' },
          ].map(({ icon, title, body }) =>
            h('div', { key: title, style: { display: 'flex', gap: 12, padding: '10px 14px', background: 'var(--b1)', borderRadius: 'var(--r)', border: '1px solid var(--b3)' } },
              h('div', { style: { fontSize: 20, flexShrink: 0, marginTop: 1 } }, icon),
              h('div', null,
                h('div', { style: { fontWeight: 600, fontSize: 'var(--fsm)', marginBottom: 3 } }, title),
                h('div', { style: { color: 'var(--t2)', fontSize: 'var(--fxs)', lineHeight: 1.6 } }, body)
              )
            )
          )
        )
      )
    ),

    h('div', { style: { marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' } },
      h('button', { className: 'btn btn-s', onClick: load }, '↺ Refresh')
    )
  );
}
