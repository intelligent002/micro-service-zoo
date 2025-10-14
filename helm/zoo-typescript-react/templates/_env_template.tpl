{{- define "zoo-typescript-react.env-template" -}}
- name: BACKEND_HOSTNAME
  value: {{ printf "http://%s/graphql" (include "zoo-common.ingress-host-for" (dict "root" $ "name" "zoo-python-fastapi")) | quote }}
{{- end -}}