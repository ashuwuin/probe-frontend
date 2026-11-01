export interface ClaimData {
  id: string;
  type: string;
  quote: string;
  file?: string | null;
  symbol?: string | null;
  expected?: string | null;
  actual?: string | null;
  repro?: string | null;
}

export interface CheckData {
  claim_id: string;
  checker: string;
  outcome: 'supports' | 'contradicts' | 'inconclusive';
  evidence: string;
  line_number?: number | null;
  details?: Record<string, any>;
}

export interface VerdictData {
  claim_id: string;
  status: 'confirmed' | 'invalid' | 'cannot-reproduce' | 'uncertain';
  confidence: 'high' | 'medium' | 'low';
  evidence: string;
  quote: string;
}

export interface WorkedExample {
  id: string;
  title: string;
  provenance: string;
  repo: { local?: string; github?: string; sha?: string };
  needs_sandbox: boolean;
  expected_overall: 'confirmed' | 'invalid' | 'cannot-reproduce' | 'uncertain';
  input_content: string;
  diff_content?: string;
  claims: ClaimData[];
  checks: CheckData[];
  verdicts: VerdictData[];
  output_markdown: string;
}

export const WORKED_EXAMPLES: WorkedExample[] = [
  {
    id: '01_confirmed_bug',
    title: 'apply_discount returns the wrong price',
    provenance: 'synthetic issue against demo repo examples/repos/shop (bug is real: apply_discount(100, 10) returns 0.0)',
    repo: { local: 'repos/shop' },
    needs_sandbox: true,
    expected_overall: 'confirmed',
    input_content: `# apply_discount returns the wrong price\n\n\`apply_discount()\` in \`shop/billing.py\` returns 0.0 for a 10% discount on 100 instead of 90.0.\n\nReproduction:\n\n\`\`\`python\nfrom shop.billing import apply_discount\n\nassert apply_discount(100, 10) == 90.0, apply_discount(100, 10)\n\`\`\`\n\nExpected: \`90.0\`. Actual: \`AssertionError: 0.0\`.`,
    claims: [
      {
        id: 'c1',
        type: 'bug_behavior',
        quote: '`apply_discount()` in `shop/billing.py` returns 0.0 for a 10% discount on 100 instead of 90.0.',
        file: 'shop/billing.py',
        symbol: 'apply_discount',
        expected: '90.0',
        actual: '0.0',
        repro: 'from shop.billing import apply_discount\n\nassert apply_discount(100, 10) == 90.0, apply_discount(100, 10)',
      },
    ],
    checks: [
      {
        claim_id: 'c1',
        checker: 'static_ast',
        outcome: 'supports',
        evidence: '`apply_discount` is defined in `shop/billing.py` at line 6 (function).',
        line_number: 6,
        details: { reason: 'symbol_found', kind: 'function' },
      },
      {
        claim_id: 'c1',
        checker: 'sandbox',
        outcome: 'supports',
        evidence: 'Reproduced failure (AssertionError): Traceback (most recent call last):\n  File "<stdin>", line 3, in <module>\nAssertionError: 0.0',
        line_number: null,
        details: { reason: 'reproduced', exit_code: 1, exception: 'AssertionError' },
      },
    ],
    verdicts: [
      {
        claim_id: 'c1',
        status: 'confirmed',
        confidence: 'high',
        evidence: 'Reproduced failure (AssertionError): Traceback (most recent call last): File "<stdin>", line 3, in <module> AssertionError: 0.0',
        quote: '`apply_discount()` in `shop/billing.py` returns 0.0 for a 10% discount on 100 instead of 90.0.',
      },
    ],
    output_markdown: `### 🔎 Probe evidence report: apply_discount returns the wrong price\n\n**Overall:** ✅ \`confirmed\`\n**Checked against:** \`examples/repos/shop\` (demo repo)\n\n| # | Claim (quoted) | Verdict | Evidence |\n|---|---|---|---|\n| c1 | "\`apply_discount()\` in \`shop/billing.py\` returns 0.0 for a 10% discount on 100 instead of 90.0." | ✅ \`confirmed\` (high) | Reproduced failure (AssertionError): AssertionError: 0.0 |\n\n<details><summary>Checks that ran</summary>\n\n- \`c1\` · \`static_ast\` → **supports** (symbol_found): \`apply_discount\` is defined in \`shop/billing.py\` at line 6.\n- \`c1\` · \`sandbox\` → **supports** (reproduced): Reproduced failure in isolated container.\n\n</details>`,
  },
  {
    id: '02_invalid_hallucinated_symbol',
    title: 'Security: parse_url_v2() leaks proxy credentials',
    provenance: 'synthetic report naming a function that does not exist, checked against real psf/requests codebase',
    repo: { github: 'psf/requests', sha: '3c7baaa05ab4aa49cc819ce3a819d260de19c157' },
    needs_sandbox: false,
    expected_overall: 'invalid',
    input_content: `# Security: parse_url_v2() leaks proxy credentials\n\n\`parse_url_v2()\` in \`src/requests/utils.py\` does not strip the userinfo part of proxy URLs before logging them.\n\nActual: user:password appears in debug logs`,
    claims: [
      {
        id: 'c1',
        type: 'security_vuln',
        quote: '`parse_url_v2()` in `src/requests/utils.py` does not strip the userinfo part of proxy URLs before logging them',
        file: 'src/requests/utils.py',
        symbol: 'parse_url_v2',
        actual: 'user:password appears in debug logs',
      },
    ],
    checks: [
      {
        claim_id: 'c1',
        checker: 'static_ast',
        outcome: 'contradicts',
        evidence: '`parse_url_v2` is not defined or mentioned in any of the 37 Python file(s) in the repository. It is not defined in the named file `src/requests/utils.py`.',
        line_number: null,
        details: { reason: 'symbol_not_found', files_scanned: 37 },
      },
    ],
    verdicts: [
      {
        claim_id: 'c1',
        status: 'invalid',
        confidence: 'high',
        evidence: '`parse_url_v2` is not defined or mentioned in any of the 37 Python file(s) in the repository. It is not defined in the named file `src/requests/utils.py`.',
        quote: '`parse_url_v2()` in `src/requests/utils.py` does not strip the userinfo part of proxy URLs before logging them',
      },
    ],
    output_markdown: `### 🔎 Probe evidence report: Security: parse_url_v2() leaks proxy credentials\n\n**Overall:** ❌ \`invalid\`\n**Checked against:** \`psf/requests@3c7baaa\`\n\n| # | Claim (quoted) | Verdict | Evidence |\n|---|---|---|---|\n| c1 | "\`parse_url_v2()\` in \`src/requests/utils.py\`..." | ❌ \`invalid\` (high) | \`parse_url_v2\` is not defined or mentioned anywhere in the repo. |\n\n<details><summary>Checks that ran</summary>\n\n- \`c1\` · \`static_ast\` → **contradicts** (symbol_not_found): symbol does not exist in AST.\n\n</details>`,
  },
  {
    id: '03_cannot_reproduce',
    title: 'format_price crashes on negative amounts',
    provenance: 'synthetic issue against demo repo (format_price(-5) actually returns "-5.00 INR")',
    repo: { local: 'repos/shop' },
    needs_sandbox: true,
    expected_overall: 'cannot-reproduce',
    input_content: `# format_price crashes on negative amounts\n\nCalling \`format_price()\` with a negative refund amount crashes the checkout page.\n\nActual: ValueError: amount must be non-negative\n\nReproduction:\n\`\`\`python\nfrom shop.billing import format_price\nprint(format_price(-5))\n\`\`\``,
    claims: [
      {
        id: 'c1',
        type: 'bug_behavior',
        quote: 'Calling `format_price()` with a negative refund amount crashes the checkout page.',
        symbol: 'format_price',
        actual: 'ValueError: amount must be non-negative',
        repro: 'from shop.billing import format_price\nprint(format_price(-5))',
      },
    ],
    checks: [
      {
        claim_id: 'c1',
        checker: 'static_ast',
        outcome: 'supports',
        evidence: '`format_price` is defined in `shop/billing.py` at line 2 (function).',
        line_number: 2,
        details: { reason: 'symbol_found' },
      },
      {
        claim_id: 'c1',
        checker: 'sandbox',
        outcome: 'contradicts',
        evidence: 'The reproduction snippet ran cleanly without raising any exception (exit code 0). Output: "-5.00 INR"',
        line_number: null,
        details: { reason: 'ran_clean', exit_code: 0, stdout: '-5.00 INR\n' },
      },
    ],
    verdicts: [
      {
        claim_id: 'c1',
        status: 'cannot-reproduce',
        confidence: 'high',
        evidence: 'The reproduction snippet ran cleanly without raising any exception (exit code 0). Output: "-5.00 INR"',
        quote: 'Calling `format_price()` with a negative refund amount crashes the checkout page.',
      },
    ],
    output_markdown: `### 🔎 Probe evidence report: format_price crashes on negative amounts\n\n**Overall:** ⚠️ \`cannot-reproduce\`\n**Checked against:** \`examples/repos/shop\`\n\n| # | Claim (quoted) | Verdict | Evidence |\n|---|---|---|---|\n| c1 | "Calling \`format_price()\` with a negative refund amount..." | ⚠️ \`cannot-reproduce\` (high) | Snippet ran cleanly with exit code 0, returning "-5.00 INR". |\n\n<details><summary>Checks that ran</summary>\n\n- \`c1\` · \`sandbox\` → **contradicts** (ran_clean): No exception raised.\n\n</details>`,
  },
  {
    id: '04_pr_with_tests',
    title: "Raise InvalidUrl if host starts with '.' character.",
    provenance: 'real merged pull request psf/requests#5414 (description and diff copied from GitHub)',
    repo: { github: 'psf/requests', sha: '658c10e84a461e5298199f20f17b510b90ac478a' },
    needs_sandbox: false,
    expected_overall: 'confirmed',
    input_content: `# Raise InvalidUrl if host starts with '.' character.\n\nCloses #5367\n\nAttempting to get \`http://.example.com\` results in a \`UnicodeError\` but should be raise \`InvalidUrl\` as attempting to get \`http://*example.com\`.\n\nI've added \`InvalidUrl\` tests for \`http://.example.com\` and \`http://*example.com\`.`,
    diff_content: `diff --git a/tests/test_requests.py b/tests/test_requests.py\n--- a/tests/test_requests.py\n+++ b/tests/test_requests.py\n@@ -2480,2 +2480,8 @@ def test_invalid_url():\n+    def test_invalid_url_dot_leading():\n+        with pytest.raises(InvalidURL):\n+            requests.get("http://.example.com")`,
    claims: [
      {
        id: 'c1',
        type: 'pr_adds_tests',
        quote: "I've added `InvalidUrl` tests for `http://.example.com` and `http://*example.com`.",
      },
    ],
    checks: [
      {
        claim_id: 'c1',
        checker: 'pr_diff',
        outcome: 'supports',
        evidence: 'The diff adds lines to 1 test file(s): tests/test_requests.py; new tests include `def test_invalid_url_dot_leading():`.',
        line_number: null,
        details: { reason: 'tests_added', test_files: ['tests/test_requests.py'] },
      },
    ],
    verdicts: [
      {
        claim_id: 'c1',
        status: 'confirmed',
        confidence: 'high',
        evidence: 'The diff adds lines to 1 test file(s): tests/test_requests.py; new tests include `def test_invalid_url_dot_leading():`.',
        quote: "I've added `InvalidUrl` tests for `http://.example.com` and `http://*example.com`.",
      },
    ],
    output_markdown: `### 🔎 Probe evidence report: Raise InvalidUrl if host starts with '.' character.\n\n**Overall:** ✅ \`confirmed\`\n**Checked against:** \`psf/requests#5414\`\n\n| # | Claim (quoted) | Verdict | Evidence |\n|---|---|---|---|\n| c1 | "I've added \`InvalidUrl\` tests..." | ✅ \`confirmed\` (high) | Diff adds test coverage in \`tests/test_requests.py\`. |\n\n<details><summary>Checks that ran</summary>\n\n- \`c1\` · \`pr_diff\` → **supports** (tests_added): Found 1 test file modified with new test methods.\n\n</details>`,
  },
  {
    id: '05_pr_missing_tests',
    title: 'Fix discount calculation',
    provenance: 'synthetic PR against demo repo: claims tests but changes only shop/billing.py with no tests added',
    repo: { local: 'repos/shop' },
    needs_sandbox: false,
    expected_overall: 'uncertain',
    input_content: `# Fix discount calculation\n\nFixes the discount calculation in \`apply_discount()\` and adds unit tests for apply_discount.`,
    diff_content: `diff --git a/shop/billing.py b/shop/billing.py\n--- a/shop/billing.py\n+++ b/shop/billing.py\n@@ -6,2 +6,2 @@ def apply_discount(price, pct):\n-    return price * (pct / 100)\n+    return price * (1 - pct / 100)`,
    claims: [
      {
        id: 'c1',
        type: 'pr_adds_tests',
        quote: 'adds unit tests for apply_discount',
      },
      {
        id: 'c2',
        type: 'pr_fixes_issue',
        quote: 'Fixes the discount calculation in `apply_discount()`',
        file: 'shop/billing.py',
        symbol: 'apply_discount',
      },
    ],
    checks: [
      {
        claim_id: 'c1',
        checker: 'pr_diff',
        outcome: 'contradicts',
        evidence: 'The PR changes 1 file(s) but none is a test file, and the diff adds no test functions.',
        line_number: null,
        details: { reason: 'no_test_files' },
      },
      {
        claim_id: 'c2',
        checker: 'static_ast',
        outcome: 'supports',
        evidence: '`apply_discount` is defined in `shop/billing.py` at line 6 (function).',
        line_number: 6,
        details: { reason: 'symbol_found' },
      },
    ],
    verdicts: [
      {
        claim_id: 'c1',
        status: 'invalid',
        confidence: 'medium',
        evidence: 'The PR changes 1 file(s) but none is a test file, and the diff adds no test functions.',
        quote: 'adds unit tests for apply_discount',
      },
      {
        claim_id: 'c2',
        status: 'uncertain',
        confidence: 'medium',
        evidence: 'Symbol verified (`apply_discount` in `shop/billing.py`), but semantic fix requires automated test execution or review.',
        quote: 'Fixes the discount calculation in `apply_discount()`',
      },
    ],
    output_markdown: `### 🔎 Probe evidence report: Fix discount calculation\n\n**Overall:** ⚠️ \`uncertain\` (Contradiction on test claims: PR claimed unit tests, but diff contains zero test files)\n\n| # | Claim (quoted) | Verdict | Evidence |\n|---|---|---|---|\n| c1 | "adds unit tests for apply_discount" | ❌ \`invalid\` (medium) | Diff adds no test functions or test files. |\n| c2 | "Fixes the discount calculation..." | ⚠️ \`uncertain\` (medium) | Symbol exists, but fix correctness is unproven without tests. |`,
  },
];

export const BENCHMARK_METRICS = {
  totalCases: 17,
  checkableCases: 5,
  maintainerIssues: 12,
  wrongInvalidVerdicts: 0,
  decisiveVerdictsWithoutEvidence: 0,
  accuracyDecided: '100%',
  checkableCoverage: '100% (5/5)',
  checkerAgreement: '16/16 (100%)',
  precision: {
    confirmed: '100%',
    cannotReproduce: '100%',
    invalid: '100%',
  },
  confusionMatrix: [
    { label: 'confirmed', confirmed: 2, cannotReproduce: 0, invalid: 0, uncertain: 4 },
    { label: 'cannot-reproduce', confirmed: 0, cannotReproduce: 1, invalid: 0, uncertain: 4 },
    { label: 'invalid', confirmed: 0, cannotReproduce: 0, invalid: 2, uncertain: 4 },
  ],
};
