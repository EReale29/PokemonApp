package main

# Deny running containers as root
deny[msg] {
    container := input.spec.template.spec.containers[_]
    container.securityContext.runAsUser == 0
    msg := sprintf("Le pod tourne en root, déploiement refusé (container: %v)", [container.name])
}

# Deny if securityContext is completely missing for Deployment
deny[msg] {
    input.kind == "Deployment"
    not input.spec.template.spec.securityContext
    msg := "Le pod doit avoir une securityContext définie"
}

# Deny if Pod is running as root (for direct Pod objects)
deny[msg] {
    input.kind == "Pod"
    input.spec.securityContext.runAsUser == 0
    msg := "Le pod tourne en root, déploiement refusé"
}
