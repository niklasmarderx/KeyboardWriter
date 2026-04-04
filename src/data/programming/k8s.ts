import { CodeSnippet } from './types';

// Kubernetes/DevOps Snippets
export const K8S_SNIPPETS: CodeSnippet[] = [
  {
    id: 'k8s-deployment',
    language: 'yaml',
    title: 'Kubernetes Deployment',
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
      - name: web-app
        image: myapp:1.0.0
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10`,
    difficulty: 'intermediate',
  },
  {
    id: 'k8s-service',
    language: 'yaml',
    title: 'Kubernetes Service',
    code: `apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  selector:
    app: web-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer`,
    difficulty: 'beginner',
  },
  {
    id: 'k8s-configmap',
    language: 'yaml',
    title: 'ConfigMap & Secret',
    code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DATABASE_HOST: "postgres-service"
  LOG_LEVEL: "info"
---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  DATABASE_PASSWORD: "supersecret"
  API_KEY: "abc123"`,
    difficulty: 'intermediate',
  },
  {
    id: 'k8s-ingress',
    language: 'yaml',
    title: 'Ingress',
    code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - myapp.example.com
    secretName: tls-secret
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80`,
    difficulty: 'advanced',
  },
  {
    id: 'k8s-hpa',
    language: 'yaml',
    title: 'Horizontal Pod Autoscaler',
    code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80`,
    difficulty: 'advanced',
  },
  {
    id: 'k8s-kubectl-basics',
    language: 'bash',
    title: 'kubectl Basic Commands',
    code: `# Get resources
kubectl get pods -n production
kubectl get deployments --all-namespaces
kubectl describe pod web-app-abc123

# Apply manifests
kubectl apply -f deployment.yaml
kubectl apply -f ./k8s/

# Manage deployments
kubectl rollout status deployment/web-app
kubectl rollout history deployment/web-app
kubectl rollout undo deployment/web-app`,
    difficulty: 'beginner',
    description: 'Essential kubectl commands',
  },
  {
    id: 'k8s-kubectl-debug',
    language: 'bash',
    title: 'kubectl Debugging',
    code: `# Logs
kubectl logs web-app-abc123 --follow --tail=100
kubectl logs -l app=web-app --since=1h

# Exec into pod
kubectl exec -it web-app-abc123 -- /bin/sh

# Port forwarding
kubectl port-forward pod/web-app-abc123 8080:3000
kubectl port-forward svc/web-app-service 8080:80

# Events and resource usage
kubectl get events --sort-by=.metadata.creationTimestamp
kubectl top pods -n production
kubectl top nodes`,
    difficulty: 'intermediate',
    description: 'Debugging and troubleshooting with kubectl',
  },
  {
    id: 'k8s-kubectl-advanced',
    language: 'bash',
    title: 'kubectl Advanced',
    code: `# Patch resources
kubectl patch deployment web-app -p '{"spec":{"replicas":5}}'

# Scale
kubectl scale deployment web-app --replicas=0
kubectl scale deployment web-app --replicas=3

# Labels and selectors
kubectl label pod web-app-abc env=staging
kubectl get pods -l "app=web-app,env=production"

# Output formats
kubectl get pods -o wide
kubectl get pod web-app-abc -o yaml
kubectl get pods -o jsonpath='{.items[*].metadata.name}'`,
    difficulty: 'advanced',
    description: 'Advanced kubectl patterns',
  },
];
