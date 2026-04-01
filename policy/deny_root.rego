package main

deny contains msg if {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  container.securityContext.runAsUser == 0
  msg := sprintf("REFUSÉ : le container '%v' tourne en root (runAsUser: 0). Déploiement bloqué.", [container.name])
}
