{{- define "zoo-typescript-angular.env_template" -}}
- name: BACKEND_HOSTNAME
  value: {{ printf "http://%s" (include "zoo-common.ingress-host-for" (dict "root" $ "name" "zoo-php-laravel-http2fpm")) | quote }}
{{- end -}}