workflow "Deploy to GitHub Pages" {
  on = "push"
  resolves = ["hugo-deploy-gh-pages"]
}

action "hugo-deploy-gh-pages" {
  uses = "velugabrewery/bootstrap@master"
  secrets = [
    "GIT_DEPLOY_KEY"
  ]
  env = {
    HUGO_VERSION = "0.53"
  }
}
