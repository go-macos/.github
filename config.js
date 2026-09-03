// Renovate for this organisation, and only this one.
//
// One organisation is a few repositories, so a run never comes near the five
// thousand API requests an hour a token has. A shared runner over hundreds of
// organisations does, and then it walks the list in the same order every time
// and the tail is never reached — silently, while the head keeps producing
// pull requests and the whole thing looks like it works. That is why this is
// here rather than in a fleet-wide runner.
//
// Each repository extends default.json beside this file, which is where the
// policy lives.
module.exports = {
  platform: 'github',
  // The account blocks pushes that expose a non-noreply email, and Renovate's
  // default author is bot@renovateapp.com. Left alone, every branch push is
  // rejected and the run still reports success.
  gitAuthor: 'tannevaled <tannevaled@users.noreply.github.com>',
  autodiscover: true,
  autodiscoverFilter: ['go-macos/**'],
  onboarding: false,
  requireConfig: 'optional',
  dependencyDashboard: true,
  repositoryCache: 'enabled',

  // default.json beside this file is a PRESET, and a preset reaches a
  // repository only through an `extends` that names it. Being in the
  // organisation applies it to nothing. With onboarding:false and
  // requireConfig:'optional' above, a repository carrying no config file is
  // processed with Renovate's factory defaults and says so only at debug level:
  //
  //     DEBUG: No renovate config file found (repository=go-macos/notify)
  //
  // Measured on 2026-09-03: 10 of the 33 repositories here, and 77 of the 835
  // across the 117 organisations that actually run Renovate. On every one of
  // them the Go toolchain rule in default.json was never in force -- the rule
  // written because go 1.27.0 auto-merged into seven repositories and because
  // go1.27.0 miscompiles on loong64 (golang/go#81000).
  //
  // inheritConfig reads that file before each repository regardless of what the
  // repository carries, so the policy is not something a repository opts into.
  inheritConfig: true,
  inheritConfigRepoName: '{{parentOrg}}/.github',
  inheritConfigFileName: 'default.json',
  // And it must be LOUD when it is not found. Left false, Renovate silently
  // proceeds without the policy -- which is the exact failure this is fixing,
  // reintroduced one level up.
  inheritConfigStrict: true,
};
