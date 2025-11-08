# Git Tagging Guide for Legacy Archive

## Overview

This guide provides instructions for properly tagging the legacy application in git to create a permanent archive reference.

## Recommended Git Tags

### Tag Structure

Use the following tags to mark the legacy application's lifecycle:

1. **`legacy-v1.0.0`** - Final stable version
2. **`legacy-deprecated`** - Deprecation announcement
3. **`legacy-archived`** - Final archived state

## Tagging Commands

### Step 1: Ensure All Changes Are Committed

```bash
# Check git status
git status

# Add any remaining files
git add .

# Commit the final state
git commit -m "chore: finalize legacy app deprecation and archival

- Add comprehensive deprecation notices
- Create migration guide
- Update package.json with deprecation warnings
- Add archive documentation
- Mark legacy app as end-of-life"
```

### Step 2: Create Annotated Tags

Annotated tags include metadata and are recommended for releases:

```bash
# Tag the final stable version
git tag -a legacy-v1.0.0 -m "Legacy app final stable version

This tag marks the last stable version of the legacy React Native 
Firebase application before deprecation.

Version: 1.0.0
Date: November 7, 2025
Status: Deprecated
Replacement: Enhanced Expo app in root directory

Features:
- User authentication and registration
- Car wash service booking
- Business discovery and search
- Vehicle management
- Location-based services
- Firebase integration

Known Issues:
- Limited TypeScript support
- No comprehensive testing framework
- Legacy navigation patterns

Migration: See ../MIGRATION.md for upgrade instructions"

# Tag the deprecation announcement
git tag -a legacy-deprecated -m "Legacy app officially deprecated

This tag marks the official deprecation of the legacy application.

Deprecation Date: November 6, 2025
End of Support: December 31, 2025
End of Life: January 1, 2026

Deprecation includes:
- Deprecation notices in README
- Migration guide created
- Package.json updated with warnings
- DEPRECATED.md documentation added

Users should migrate to the enhanced Expo version in the root directory.
See MIGRATION.md for detailed migration instructions."

# Tag the final archived state
git tag -a legacy-archived -m "Legacy app archived

This tag marks the final archived state of the legacy application.

Archive Date: November 7, 2025
Status: Read-only archive
Support: None

Archive includes:
- Complete source code preservation
- All documentation maintained
- Archive metadata added
- Git tagging guide created

This version receives no further updates. All development continues
in the enhanced Expo version in the root directory.

For historical reference only."
```

### Step 3: Push Tags to Remote

```bash
# Push all tags to remote repository
git push origin --tags

# Or push specific tags
git push origin legacy-v1.0.0
git push origin legacy-deprecated
git push origin legacy-archived
```

## Tag Verification

### View All Tags

```bash
# List all tags
git tag -l

# List only legacy tags
git tag -l "legacy-*"
```

### View Tag Details

```bash
# Show tag information
git show legacy-v1.0.0
git show legacy-deprecated
git show legacy-archived
```

### Verify Tag on Remote

```bash
# Fetch tags from remote
git fetch --tags

# List remote tags
git ls-remote --tags origin
```

## Using Tags for Reference

### Checkout Specific Tagged Version

```bash
# Checkout a specific tag (detached HEAD state)
git checkout legacy-v1.0.0

# Create a branch from a tag
git checkout -b legacy-reference legacy-v1.0.0

# Return to main branch
git checkout main
```

### Compare Tags

```bash
# Compare two tags
git diff legacy-v1.0.0 legacy-archived

# Show commits between tags
git log legacy-v1.0.0..legacy-archived
```

### Archive Tag to File

```bash
# Create archive from tag
git archive --format=tar.gz --prefix=legacy-app/ legacy-archived -o legacy-app-archive.tar.gz

# Create zip archive
git archive --format=zip --prefix=legacy-app/ legacy-archived -o legacy-app-archive.zip
```

## Tag Management

### Delete Tag (If Needed)

```bash
# Delete local tag
git tag -d legacy-v1.0.0

# Delete remote tag
git push origin --delete legacy-v1.0.0
```

### Update Tag (Not Recommended)

⚠️ **Warning**: Updating tags is generally not recommended, especially for release tags.

If absolutely necessary:

```bash
# Delete old tag
git tag -d legacy-v1.0.0
git push origin --delete legacy-v1.0.0

# Create new tag
git tag -a legacy-v1.0.0 -m "Updated message"
git push origin legacy-v1.0.0
```

## Best Practices

### DO:
- ✅ Use annotated tags (`-a` flag) for releases
- ✅ Include detailed messages with context
- ✅ Push tags to remote repository
- ✅ Document tag purpose and contents
- ✅ Use consistent naming conventions

### DON'T:
- ❌ Delete or modify release tags
- ❌ Use lightweight tags for releases
- ❌ Forget to push tags to remote
- ❌ Use ambiguous tag names
- ❌ Tag uncommitted changes

## Tag Naming Convention

### Format
```
legacy-<type>-<version>
```

### Examples
- `legacy-v1.0.0` - Version release
- `legacy-deprecated` - Status marker
- `legacy-archived` - Archive marker
- `legacy-hotfix-1.0.1` - Hotfix (if needed)

## Integration with CI/CD

### GitHub Releases

After tagging, create GitHub releases:

```bash
# Using GitHub CLI
gh release create legacy-v1.0.0 \
  --title "Legacy App v1.0.0 (Deprecated)" \
  --notes "Final stable version before deprecation. See MIGRATION.md for upgrade instructions."

gh release create legacy-archived \
  --title "Legacy App Archived" \
  --notes "Legacy application archived. No further updates. Use enhanced version in root directory."
```

### Automated Tagging

For future reference, here's a script for automated tagging:

```bash
#!/bin/bash
# tag-legacy.sh

VERSION="1.0.0"
DATE=$(date +"%B %d, %Y")

# Create version tag
git tag -a "legacy-v${VERSION}" -m "Legacy app final stable version

Version: ${VERSION}
Date: ${DATE}
Status: Deprecated

See ../MIGRATION.md for upgrade instructions."

# Create deprecated tag
git tag -a "legacy-deprecated" -m "Legacy app officially deprecated

Deprecation Date: ${DATE}
See DEPRECATED.md for details."

# Create archived tag
git tag -a "legacy-archived" -m "Legacy app archived

Archive Date: ${DATE}
Status: Read-only archive"

# Push all tags
git push origin --tags

echo "✅ Legacy app tagged and pushed successfully"
```

## Verification Checklist

After tagging, verify:

- [ ] All tags created locally
- [ ] All tags pushed to remote
- [ ] Tag messages are descriptive
- [ ] Tags point to correct commits
- [ ] GitHub releases created (if applicable)
- [ ] Documentation references tags
- [ ] Team notified of tags

## Troubleshooting

### Tag Not Showing on Remote

```bash
# Fetch all tags
git fetch --tags

# Force push tag
git push origin legacy-v1.0.0 --force
```

### Tag Points to Wrong Commit

```bash
# Delete and recreate
git tag -d legacy-v1.0.0
git tag -a legacy-v1.0.0 <commit-hash> -m "Message"
git push origin legacy-v1.0.0 --force
```

### Cannot Push Tags

```bash
# Check remote configuration
git remote -v

# Verify permissions
git push --dry-run origin --tags
```

## Additional Resources

### Git Documentation
- [Git Tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
- [Git Tag Command](https://git-scm.com/docs/git-tag)
- [Git Archive](https://git-scm.com/docs/git-archive)

### GitHub Documentation
- [Creating Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- [About Tags](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/managing-commits/managing-tags)

---

## Summary

This guide provides comprehensive instructions for properly tagging and archiving the legacy application. Follow these steps to create a permanent, well-documented archive that can be referenced in the future.

**Next Steps:**
1. Review and execute tagging commands
2. Verify tags are created and pushed
3. Create GitHub releases (optional)
4. Update team documentation
5. Notify stakeholders of archive completion

**Questions?** See the main MIGRATION.md or create an issue in the repository.
