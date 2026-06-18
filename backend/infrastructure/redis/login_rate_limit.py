def get_client_ip(request):
    # print(request)
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    # print(forwarded)
    if forwarded:
        return forwarded.split(",")[0]

    return request.META.get("REMOTE_ADDR")

