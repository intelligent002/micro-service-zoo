{{- define "zoo-php-laravel-http2fpm.env_template" -}}
- name: ZOO_PHP_LARAVEL_HOST
  value: "{{ .Release.Name }}-zoo-php-laravel"
{{- end -}}