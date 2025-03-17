---
title: Version Support Policy
contents: false
---

## Introduction

| Version | New features | Bug fixes | Security fixes     |
|---------|--------------|-----------|--------------------|
| 1.x     | ❌            | ❌         | ✅ until Jul 1 2025 |
| 2.x     | ❌            | ❌         | ✅ until Jan 1 2026 |
| 3.x     | ❌            | ✅         | ✅                  |
| 4.x     | ✅            | ✅         | ✅                  |

## New features

Pull requests for new features are only accepted for the latest major version, except in special circumstances. Once a new major version is released, the Filament team will no longer accept pull requests for new features in previous versions. Any open pull requests will either be redirected to target the latest major version or closed, depending on conflicts with the new target branch.

## Bug fixes

After a major version is released, the Filament team will continue to merge pull requests for bug fixes in the previous major version for two years. After this period, pull requests for that version will no longer be accepted.

The Filament team processes bug reports for supported versions in chronological order, though critical bugs may be prioritized. Bug fixes are typically developed only for the latest major version. However, contributors can backport fixes to other supported versions by submitting pull requests.

## Security fixes

The Filament team currently plans to continue providing security fixes for major versions for at least three years. When the team decides a major version will no longer receive security fixes, they will announce the change at least one year before discontinuing support.

If you discover a security vulnerability in Filament, please report it by emailing Dan Harrin at [dan@danharrin.com](mailto:dan@danharrin.com). All security vulnerabilities will be addressed promptly.

Please note that while a Filament version may receive security fixes, its underlying dependencies (PHP, Laravel, and Livewire) may no longer be supported. Therefore, applications using older versions of Filament could still be vulnerable to security issues in these dependencies.
